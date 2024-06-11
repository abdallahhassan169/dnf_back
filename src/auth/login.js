import pool from "../../config.js";
import jwt from "jsonwebtoken";
import { secret } from "../../config.js";
import bcrypt from "bcrypt";
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const rows = await pool.query(
      `select * from "public".users where email = ($1)   `,
      [email]
    );

    const user = rows.rows[0];
    console.log(user?.password, password, email);
    const isPasswordMatch = await bcrypt.compare(password, user?.password);
    if (user) {
      if (email === user.email && isPasswordMatch && user.is_verified) {
        const token = jwt.sign(user, secret);

        res.json({ token: token });
      } else res.status(401).send({ message: "Authentication failed." });
    } else {
      res.status(401).json({ message: "Authentication failed." });
    }
  } catch (e) {
    res.status(500).send({ err: e });
  }
};
