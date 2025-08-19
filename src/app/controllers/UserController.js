import { v4 } from "uuid";
import * as Yup from "yup";
import bcrypt from "bcrypt";
import User from "../models/User";

class UserController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      number_phone: Yup.string().required().min(10).max(11),
      cnpj: Yup.string().required(),
      enterpriseName: Yup.string().required(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    });

    try {
      schema.validateSync(req.body, { abortEarly: false });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: "User already exists." });
    }

    const { name, email, number_phone, cnpj, enterpriseName, password, admin } =
      req.body;

    // Aqui geramos o hash da senha
    const password_hash = await bcrypt.hash(password, 10); // 10 rounds de salt

    const user = await User.create({
      id: v4(),
      name,
      email,
      number_phone,
      cnpj,
      enterpriseName,
      password_hash, // salva o hash, não a senha
      admin,
    });

    return res.status(201).json({
      id: user.id,
      name,
      email,
      number_phone,
      cnpj,
      enterpriseName,
      admin,
    });
  }
}

export default new UserController();
