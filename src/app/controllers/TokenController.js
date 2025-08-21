import { v4 } from "uuid";
import * as Yup from "yup";
import sgMail from "@sendgrid/mail";
import AccessKey from "../models/AccessKey";
import User from "../models/User";

// Configura a API Key do SendGrid
sgMail.setApiKey(
  "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",
);

// Função para gerar chave de 7 letras
function generateKey(length = 7) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let key = "";
  for (let i = 0; i < length; i += 1) {
    key += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  return key;
}

class TokenController {
  // Gera chave usando email (sem autenticação)
  async generate(req, res) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
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

      // Gera chave de 7 letras e define expiração
      const key = generateKey(7);
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos

      const accessKey = await AccessKey.create({
        id: v4(),
        key,
        expires_at: expiresAt,
        user_id: user.id,
      });

      // Envia a chave por e-mail
      const msg = {
        to: user.email,
        from: "kcoliveira@blockbit.com", // e-mail verificado no SendGrid
        subject: "Sua chave de acesso",
        text: `Olá ${user.name}, sua chave é: ${key}. Valida por 5 minutos.`,
        mailSettings: { sandboxMode: { enable: false } }, // garante envio real
      };

      try {
        await sgMail.send(msg);
        console.log(`Chave enviada por e-mail para ${user.email}`);
      } catch (err) {
        console.error(
          "Erro ao enviar e-mail:",
          err.response?.body || err.message,
        );
      }

      return res.status(201).json({
        message: "Chave gerada e enviada por e-mail!",
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
    const schema = Yup.object({ key: Yup.string().required() });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    try {
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
