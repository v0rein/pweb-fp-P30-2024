// src/models/Invoice.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoice extends Document {
  user: mongoose.Types.ObjectId;
  bill: number;
  created_at: Date;
}

const InvoiceSchema: Schema = new Schema({
  user: { 
    type: mongoose.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bill: { 
    type: Number, 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IInvoice>('Invoice', InvoiceSchema);