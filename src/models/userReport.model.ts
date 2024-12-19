// src/models/UserReport.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IUserReport extends Document {
  message: string;
  created_at: Date;
}

const UserReportSchema: Schema = new Schema({
  message: { 
    type: String, 
    required: true 
  },
  created_at: { 
    type: Date, 
    default: Date.now 
  }
});

export default mongoose.model<IUserReport>('UserReport', UserReportSchema);