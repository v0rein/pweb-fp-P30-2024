// src/models/Payment.ts
import mongoose, { Schema, Document } from 'mongoose';

export enum PaymentMethod {
  QRIS = 'QRIS',
  BANK_TRANSFER = 'BANK_TRANSFER'
}

export interface IPayment extends Document {
  user: mongoose.Types.ObjectId;
  total_bill: number;
  payment_method: PaymentMethod;
  rent_periods: number;
  bank_name?: string;
  created_at: Date;
}

const PaymentSchema: Schema = new Schema({
  user: { 
    type: mongoose.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  total_bill: { 
    type: Number, 
    required: true 
  },
  payment_method: { 
    type: String, 
    enum: Object.values(PaymentMethod), 
    required: true 
  },
  rent_periods: { 
    type: Number, 
    enum: [3, 6], 
    required: true 
  },
  bank_name: { 
    type: String, 
    required: function(this: any) { 
      return this.payment_method === PaymentMethod.BANK_TRANSFER; 
    }
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IPayment>('Payment', PaymentSchema);