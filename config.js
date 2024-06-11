import pg from "pg";
const pool = new pg.Pool({
  user: "abdallah",
  host: "dpg-cpisr7q1hbls73bmidi0-a.oregon-postgres.render.com",
  database: "dnf",
  password: "h2L3IvIrN82dzPOoPbQDvkOfn7s6qDEI",
  port: 5432,
  max: 20,
  idleTimeoutMillis: 30000,
  ssl: {
    rejectUnauthorized: false,
  },
});
export const secret = "J3mlt0WzyktgiyXiRff5ua883P9t7jMedf2";
export const saltRounds = 10;
export default pool;
export const port = 3005;
export const gmail_pass = "dvsx bcuq vqil tjgz";
