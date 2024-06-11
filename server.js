import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { port } from "./config.js";
import { AuthRouter } from "./src/auth/router.js";
import { OrderRouter } from "./src/orders/router.js";
import authMiddleware, { authorized } from "./src/auth/middleware.js";

const app = express();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json());
app.use(authMiddleware);
app.use(authorized);
app.use("/auth", AuthRouter);
app.use("/orders", OrderRouter);
app.listen(port, () => console.log("server up on port :" + port));
