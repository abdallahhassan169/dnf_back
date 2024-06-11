import { gmail_pass, saltRounds } from "../../config.js";
import bcrypt from "bcrypt";
import pool from "../../config.js";
import { validationResult } from "express-validator";

import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sovghab@gmail.com",
    pass: gmail_pass,
  },
});

export const sendEmail = async (to, subject, text) => {
  try {
    const mailOptions = {
      from: "sovghab@gmail.com", // Replace with your email address
      to: to,
      subject: subject,
      text: text,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false };
  }
};

function generateSixDigitCode() {
  return Math.floor(100000 + Math.random() * 900000);
}

export const register_user = async (req, res) => {
  const client = await pool.connect();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //generate otp to send it to user
    const code = generateSixDigitCode();
    const { email, password, phone, national_id, user_name } = req.body;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // register the user into db
    await client.query("BEGIN");
    // check if user exists in db to handle otp in frontend
    const emailCheck = await client.query(
      `SELECT id FROM public.users WHERE email = $1`,
      [email]
    );

    if (emailCheck.rows.length > 0) {
      const update_otp = await client.query(
        `update users set code = $1 where email = $2 returning code`,
        [code, email]
      );
      console.log(update_otp);
      const send_to_user = await sendEmail(
        email,
        "confirmation message",
        `hello this is the confirmation code please don't share with anyone ${code}`
      );
      await client.query("Commit");

      return res
        .status(200)
        .json({ exists: true, message: "user already exists", status: 200 });
    }
    const result = await client.query(
      `INSERT INTO public.users(
        email, password, phone, national_id ,user_name , code )
      VALUES ($1, $2, $3, $4 , $5 , $6) returning id;`,
      [email, hashedPassword, phone, national_id, user_name, code]
    );
    console.log(result);
    //send email with code to the registered email

    const send_to_user = await sendEmail(
      email,
      "confirmation message",
      `hello this is the confirmation code please don't share with anyone ${code}`
    );
    console.log(send_to_user);
    if (!send_to_user.success) {
      // Rollback the transaction if email sending fails
      await client.query("ROLLBACK");
      return res.status(400).send({
        error: "Failed to send confirmation email. Please try again later.",
      });
    }
    await client.query("Commit");
    res.status(200).send({ message: "registered successfully", status: 200 });
  } catch (e) {
    console.error(e);
    //await client.query("ROLLBACK");
    res.status(500).send({ error: e.message });
  } finally {
    client.release();
  }
};

export const verify = async (req, res) => {
  const client = await pool.connect();

  try {
    const { email, code } = req.body;

    const { rows } = await client.query(
      `select code , id from users where email = $1 `,
      [email]
    );
    console.log(rows[0]);

    if (!rows[0]?.code) {
      return res.status(500).send({ error: "email not registered" });
    }

    if (code === rows[0]?.code) {
      await pool.query(`update users set is_verified = true where id = $1 `, [
        rows[0]?.id,
      ]);
    } else {
      return res.status(500).send({ error: "code is incorrect" });
    }
    return res
      .status(200)
      .send({ message: "verified successfully", status: 200 });
  } catch (e) {
    console.error(e);
    await client.query("ROLLBACK");
    return res.status(500).send({ error: e.message });
  } finally {
    client.release();
  }
};
