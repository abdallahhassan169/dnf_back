import express from "express";
import { make_order } from "./orders.js";

export const OrderRouter = express.Router();

OrderRouter.post("/make_order", make_order);
