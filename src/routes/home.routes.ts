import { Router } from "express";

export const authRouter = Router();

import { Login } from "../controllers/home.controller";

authRouter.post("/", Login);
