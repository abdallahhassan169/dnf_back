import pool from "../../config.js";

export const get_user_data = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { rows } = await pool.query(
      `select user_name , byscles_num from users where id = $1 `,
      [user_id]
    );
    return res.send({ rows, status: 200 }).status(200);
  } catch (e) {
    console.log(e);
    res.status(500).send({ err: e });
  }
};
