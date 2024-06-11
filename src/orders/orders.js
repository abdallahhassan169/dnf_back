import pool from "../../config.js";

export const make_order = async (req, res) => {
  try {
    const { qty } = req.body;
    const user_id = req.user.id;
    const rows = await pool.query(
      `update users set byscles_num = byscles_num + $1::int where id = $2  `,
      [qty, user_id]
    );
    return res.send({ message: "your order done successfully" }).status(200);
  } catch (e) {
    console.log(e);
    res.status(500).send({ err: e });
  }
};
