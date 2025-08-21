import AccessKeyAttempt from "../models/AccessKeyAttempt";
import User from "../models/User";

class ValidationHistoryController {
  async index(req, res) {
    try {
      const { limit = 20, page = 1 } = req.query;
      const limitNum = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
      const pageNum = Math.max(parseInt(page, 10) || 1, 1);
      const offset = (pageNum - 1) * limitNum;

      const { rows, count } = await AccessKeyAttempt.findAndCountAll({
        limit: limitNum,
        offset,
        order: [["created_at", "DESC"]],
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ],
        attributes: ["id", "key", "email", "success", "reason", "created_at"],
      });

      return res.json({
        data: rows.map((r) => ({
          id: r.id,
          key: r.key,
          email: r.email || r.user?.email || null,
          name: r.user?.name || null,
          success: r.success,
          reason: r.reason,
          created_at: r.created_at,
        })),
        meta: {
          page: pageNum,
          limit: limitNum,
          total: count,
          totalPages: Math.max(Math.ceil(count / limitNum), 1),
        },
      });
    } catch (err) {
      console.error("Erro ao listar histórico:", err);
      return res.status(500).json({ error: "Erro ao listar histórico." });
    }
  }
}

export default new ValidationHistoryController();
