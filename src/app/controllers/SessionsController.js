import * as Yup from "yup";
import jwt from "jsonwebtoken";
import User from "../models/User";

class SessionController {
  async store(request, response) {
    const schema = Yup.object({
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
    });

    const isValid = await schema.isValid(request.body);

    if (!isValid) {
      return response
        .status(401)
        .json({ error: "Make sure your email or password are correct" });
    }

    const { email, password } = request.body;

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      return response
        .status(401)
        .json({ error: "Make sure your email or password are correct" });
    }

    const isSamePassword = await user.comparePassword(password);

    if (!isSamePassword) {
      return response
        .status(401)
        .json({ error: "Make sure your email or password are correct" });
    }

    // Gera o token JWT
    const token = jwt.sign(
      { id: user.id, admin: user.admin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    return response.status(200).json({
      user: {
        id: user.id,
        name: user.name,
        email,
        admin: user.admin,
      },
      token, // aqui tá o token JWT para usar nas próximas requisições
    });
  }
}

export default new SessionController();
