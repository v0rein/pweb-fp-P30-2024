// src/models/DamageReport.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IDamageReport extends Document {
  user: mongoose.Types.ObjectId;
  message: string;
  created_at: Date;
}

const DamageReportSchema: Schema = new Schema({
  user: { 
    type: mongoose.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IDamageReport>('DamageReport', DamageReportSchema);