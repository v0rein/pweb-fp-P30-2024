// src/routes/adminRoutes.ts
import express from 'express';
import { 
  getDashboardOccupancy, 
  getUserDetails,
  removeUser,
  getFacilityReports,
  getUserReports
} from '../controllers/admin.controller';
import { Verification, checkUserRole } from '../middleware/auth';
import { Role } from '../models/home.model';

export const adminRouter = express.Router();

// @route   GET /admin/dashboard
// @desc    Get dashboard occupancy
adminRouter.get('/dashboard', Verification, checkUserRole(Role.ADMIN), getDashboardOccupancy);

// @route   GET /admin/penghuni/:id
// @desc    Get specific user details
adminRouter.get('/penghuni/:id', Verification, checkUserRole(Role.ADMIN), getUserDetails);

// @route   DELETE /admin/penghuni/:id
// @desc    Remove user
adminRouter.delete('/penghuni/:id', Verification, checkUserRole(Role.ADMIN), removeUser);

// @route   GET /admin/laporan/fasilitas
// @desc    Get facility reports
adminRouter.get('/laporan/fasilitas', Verification, checkUserRole(Role.ADMIN), getFacilityReports);

// @route   GET /admin/laporan/penghuni
// @desc    Get user reports
adminRouter.get('/laporan/penghuni', Verification, checkUserRole(Role.ADMIN), getUserReports);
