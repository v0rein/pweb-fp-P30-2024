// src/controllers/userController.ts
import { Request, Response } from 'express';
import Invoice from '../models/invoice.model';
import DamageReport from '../models/damageReport.model';
import UserReport from '../models/userReport.model';

export const getUserDashboard = async (req: Request, res: Response) => {
  try {
    // Fetch invoice history for the logged-in user
    const invoices = await Invoice.find({ user: req.user._id })
      .sort({ created_at: -1 });
    
    res.json({
      username: req.user.username,
      invoice_history: invoices
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user dashboard', error });
  }
};

export const getRoomDetails = (req: Request, res: Response) => {
  // Hardcoded room details as per requirements
  const roomDetails = {
    size: '4x5',
    inclusions: [
      'TV',
      'Study Table',
      'Study Chair',
      'Queen Size Bed'
    ],
    rent_options: [
      { period: 3, price: 6000000 },
      { period: 6, price: 12000000 }
    ],
    additional_services: [
      { 
        name: 'Laundry', 
        prices: { 
          '3 months': 600000, 
          '6 months': 1200000 
        }
      },
      { 
        name: 'Cleaning Service', 
        prices: { 
          '3 months': 300000, 
          '6 months': 600000 
        }
      },
      { 
        name: 'Catering', 
        prices: { 
          '3 months': 3000000, 
          '6 months': 6000000 
        }
      }
    ]
  };

  res.json(roomDetails);
};

export const submitDamageReport = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const report = new DamageReport({
      user: req.user._id,
      message
    });

    await report.save();

    res.status(201).json({ 
      message: 'Damage report submitted successfully',
      report 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting damage report', error });
  }
};

export const submitUserReport = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    const report = new UserReport({ message });

    await report.save();

    res.status(201).json({ 
      message: 'User report submitted successfully',
      report 
    });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting user report', error });
  }
};