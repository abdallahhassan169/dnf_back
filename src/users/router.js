import express from "express";

import { get_user_data } from "./users.js";

export const UserRouter = express.Router();

UserRouter.post("/get_user_data", get_user_data);
