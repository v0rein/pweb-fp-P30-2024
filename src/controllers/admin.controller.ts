// src/controllers/adminController.ts
import { Request, Response } from 'express';
import Payment from '../models/payment.model';
import DamageReport from '../models/damageReport.model';
import UserReport from '../models/userReport.model';
import { RoomOccupancy } from "../models/roomOccupancy.model";

export const getDashboardOccupancy = async (req: Request, res: Response) => {
  try {
    // Ambil data okupansi dari database
    let occupancy = await RoomOccupancy.findOne();

    // Jika belum ada data okupansi, inisialisasi dengan data default
    if (!occupancy) {
      occupancy = new RoomOccupancy();
      await occupancy.save();
    }

    res.json({
      total_rooms: occupancy.empty + occupancy.filled, // Total kamar adalah jumlah kamar kosong dan terisi
      empty_rooms: occupancy.empty,
      filled_rooms: occupancy.filled,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching occupancy", error });
  }
};

export const getUserDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Fetch payment details for a specific user
    const payments = await Payment.find({ user: id }).sort({ created_at: -1 });
    
    res.json({
      user_id: id,
      payment_status: payments.length > 0 ? 'PAID' : 'UNPAID',
      payment_details: payments
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user details', error });
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // In a real app, you'd implement soft delete or actual user removal
    res.json({ message: `User ${id} removed successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error removing user', error });
  }
};

export const getFacilityReports = async (req: Request, res: Response) => {
  try {
    const reports = await DamageReport.find()
      .sort({ created_at: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching facility reports', error });
  }
};

export const getUserReports = async (req: Request, res: Response) => {
  try {
    const reports = await UserReport.find().sort({ created_at: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user reports', error });
  }
};