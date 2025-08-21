import { Op } from "sequelize";
import User from "../models/User";
import AccessKey from "../models/AccessKey";

class StatsController {
  async index(req, res) {
    try {
      const [totalClients, totalTokens, validCodes, invalidCodes] =
        await Promise.all([
          User.count({ where: { admin: false } }),
          AccessKey.count(),
          AccessKey.count({ where: { expires_at: { [Op.gt]: new Date() } } }),
          AccessKey.count({ where: { expires_at: { [Op.lte]: new Date() } } }),
        ]);

      return res.json({
        clients: totalClients,
        tokens: totalTokens,
        validation: {
          valid: validCodes,
          invalid: invalidCodes,
        },
      });
    } catch (err) {
      console.error("Erro ao obter estatísticas:", err);
      return res.status(500).json({ error: "Erro ao obter estatísticas." });
    }
  }
}

export default new StatsController();
