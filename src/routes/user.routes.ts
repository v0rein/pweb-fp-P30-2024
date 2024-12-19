// src/routes/userRoutes.ts
import express from "express";
import {
  getUserDashboard,
  getRoomDetails,
  submitDamageReport,
  submitUserReport,
} from "../controllers/user.controller";
import { 
    calculatePayment, 
    createPayment 
  } from '../controllers/payment.controller';
import { Verification, checkUserRole } from "../middleware/auth";
import { Role } from "../models/home.model";

export const userRouter = express.Router();

// @route   GET /user
// @desc    Get user dashboard
userRouter.get("/", Verification, checkUserRole(Role.USER), getUserDashboard);

// @route   GET /user/sewa
// @desc    Get room details
userRouter.get("/sewa", Verification, checkUserRole(Role.USER), getRoomDetails);

// @route   POST /user/laporan/fasilitas
// @desc    Submit damage report
userRouter.post(
  "/laporan/fasilitas", Verification,
  checkUserRole(Role.USER),
  submitDamageReport
);

// @route   POST /user/laporan/penghuni
// @desc    Submit user report
userRouter.post("/laporan/penghuni", Verification, checkUserRole(Role.USER), submitUserReport);

// @route   POST /payments/calculate
// @desc    Calculate total payment
userRouter.post('/calculate', Verification, checkUserRole(Role.USER), calculatePayment);

// @route   POST /payments/create
// @desc    Create new payment
userRouter.post('/sewa/bayar', Verification, checkUserRole(Role.USER), createPayment);

