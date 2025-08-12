import { v4 } from "uuid";
import * as Yup from "yup";
import crypto from "crypto";
import AccessKey from "../models/AccessKey";
import User from "../models/User";

class TokenController {
  // Gera chave usando email (sem autenticação)
  async generate(req, res) {
    const schema = Yup.object({
      email: Yup.string(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    try {
      const { email } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      const key = crypto.randomBytes(16).toString("hex");
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

      const accessKey = await AccessKey.create({
        id: v4(),
        key,
        expires_at: expiresAt,
        user_id: user.id,
      });

      return res.status(201).json({
        key: accessKey.key,
        expires_at: accessKey.expires_at,
      });
    } catch (err) {
      console.error("Erro ao gerar chave:", err);
      return res.status(500).json({ error: "Erro ao gerar chave." });
    }
  }

  // Valida chave, só admin autenticado pode usar
  async validate(req, res) {
    const schema = Yup.object({
      key: Yup.string().required(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    try {
      // req.user vem do middleware de autenticação
      if (!req.user || !req.user.admin) {
        return res.status(403).json({ error: "Acesso negado." });
      }

      const { key } = req.body;

      const accessKey = await AccessKey.findOne({ where: { key } });
      if (!accessKey) {
        return res.status(404).json({ error: "Chave não encontrada." });
      }

      if (new Date() > accessKey.expires_at) {
        return res.status(400).json({ error: "Chave expirada." });
      }

      const user = await User.findByPk(accessKey.user_id);

      return res.json({
        valid: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          number_phone: user.number_phone,
          cnpj: user.cnpj,
          enterpriseName: user.enterpriseName,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Erro ao validar chave." });
    }
  }
}

export default new TokenController();
