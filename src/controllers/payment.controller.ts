// src/controllers/paymentController.ts
import { Request, Response } from "express";
import Payment, { PaymentMethod } from "../models/payment.model";
import PDFDocument from "pdfkit";
import Invoice from "../models/invoice.model";
import {RoomOccupancy} from "../models/roomOccupancy.model";

// Pricing constants
const ROOM_PRICES: Record<3 | 6, number> = {
  3: 6000000,
  6: 12000000,
};

const SERVICE_PRICES = {
  laundry: { 3: 600000, 6: 1200000 },
  cleaningService: { 3: 300000, 6: 600000 },
  catering: { 3: 3000000, 6: 6000000 },
};

export const calculatePayment = (
  req: Request<
    Record<string, any>, // Parameter
    any, // Response Body
    {
      rentPeriods: 3 | 6;
      additionalServices?: {
        laundry?: boolean;
        cleaningService?: boolean;
        catering?: boolean;
      };
    } // Request Body
  >,
  res: Response
): void => {
  const { rentPeriods, additionalServices } = req.body;

  // Validate rent periods
  if (![3, 6].includes(rentPeriods)) {
    res.status(400).json({ message: "Invalid rent period" });
    return;
  }

  // Calculate base room price
  let amount = ROOM_PRICES[rentPeriods];

  // Add additional services
  if (additionalServices) {
    if (additionalServices.laundry) {
      amount += SERVICE_PRICES.laundry[rentPeriods];
    }
    if (additionalServices.cleaningService) {
      amount += SERVICE_PRICES.cleaningService[rentPeriods];
    }
    if (additionalServices.catering) {
      amount += SERVICE_PRICES.catering[rentPeriods];
    }
  }

  res.json({ amount });
};

export const createPayment = async (req: Request, res: Response) => {
  try {
    const { total_bill, payment_method, rent_periods, bank_name } = req.body;
    const payment = new Payment({
      user: req.user._id,
      total_bill,
      payment_method,
      rent_periods,
      bank_name:
        payment_method === PaymentMethod.BANK_TRANSFER ? bank_name : undefined,
    });

    await payment.save();
     // Create invoice after successful payment
     const invoice = new Invoice({
      user: req.user._id,
      bill: total_bill,
    });

    await invoice.save();

    let occupancy = await RoomOccupancy.findOne();

    // Jika belum ada data okupansi, inisialisasi dengan data default
    if (!occupancy) {
      occupancy = new RoomOccupancy();
    }

    if (occupancy.empty > 0) {
      occupancy.empty -= 1; // Kurangi jumlah kamar kosong
      occupancy.filled += 1; // Tambahkan jumlah kamar terisi
    } else {
      res.status(400).json({ message: "No empty rooms available" });
      return;
    }

    await occupancy.save();
    // Generate PDF Invoice
    const pdfDoc = new PDFDocument();
    pdfDoc.pipe(res);

    pdfDoc.fontSize(25).text("Kost Management Invoice", 100, 80);
    pdfDoc
      .fontSize(12)
      .text(`Total Bill: Rp ${total_bill.toLocaleString()}`, 100, 150)
      .text(`Payment Method: ${payment_method}`, 100, 170)
      .text(`Rent Period: ${rent_periods} months`, 100, 190);

    if (payment_method === PaymentMethod.BANK_TRANSFER) {
      pdfDoc.text(`Bank Name: ${bank_name}`, 100, 210);
    }

    pdfDoc.end();
  } catch (error) {
    res.status(500).json({ message: "Payment creation failed", error });
  }
};
