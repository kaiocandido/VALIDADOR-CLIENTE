import { v4 } from "uuid";
import * as Yup from "yup";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import User from "../models/User";

class UserController {
  async index(req, res) {
    try {
      const {
        search = "",
        page = 1,
        limit = 10,
        orderBy = "created_at",
        order = "DESC",
      } = req.query;

      // validações simples de ordenação
      const allowedOrderBy = ["created_at", "updated_at", "name", "email"];
      const safeOrderBy = allowedOrderBy.includes(orderBy)
        ? orderBy
        : "created_at";
      const safeOrder = String(order).toUpperCase() === "ASC" ? "ASC" : "DESC";

      const pageNum = Math.max(parseInt(page, 10) || 1, 1);
      const limitNum = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);
      const offset = (pageNum - 1) * limitNum;

      const where = {};
      if (search) {
        const term = `%${search}%`;
        where[Op.or] = [
          { name: { [Op.iLike]: term } },
          { email: { [Op.iLike]: term } },
          { cnpj: { [Op.iLike]: term } },
          { number_phone: { [Op.iLike]: term } },
          { enterprise_name: { [Op.iLike]: term } },
        ];
      }

      const { rows, count } = await User.findAndCountAll({
        where,
        limit: limitNum,
        offset,
        order: [[safeOrderBy, safeOrder]],
        attributes: [
          "id",
          "name",
          "email",
          "cnpj",
          "number_phone",
          ["enterprise_name", "enterpriseName"],
          "admin",
          "created_at",
          "updated_at",
        ],
      });

      return res.json({
        data: rows,
        meta: {
          page: pageNum,
          limit: limitNum,
          total: count,
          totalPages: Math.max(Math.ceil(count / limitNum), 1),
          orderBy: safeOrderBy,
          order: safeOrder,
          search,
        },
      });
    } catch (err) {
      console.error("Erro ao listar usuários:", err);
      return res.status(500).json({ error: "Erro ao listar usuários." });
    }
  }

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

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({
      id: v4(),
      name,
      email,
      number_phone,
      cnpj,
      enterpriseName,
      password_hash,
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
