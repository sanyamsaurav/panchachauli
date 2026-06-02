import mongoose, { Schema, Model } from 'mongoose';
import type { ISchoolAspirant } from '@/types/models';

const SchoolAspirantSchema = new Schema<ISchoolAspirant>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name must not exceed 100 characters'],
    },
    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      maxlength: [200, 'Location must not exceed 200 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
      match: [/^\+?[0-9\s\-\(\)]{10,20}$/, 'Please provide a valid phone number'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message must not exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'contacted', 'enrolled', 'rejected'],
      default: 'new',
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes must not exceed 1000 characters'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
SchoolAspirantSchema.index({ status: 1 });
SchoolAspirantSchema.index({ createdAt: -1 });
SchoolAspirantSchema.index({ email: 1 });
SchoolAspirantSchema.index({ name: 1 });

if (mongoose.models.SchoolAspirant) {
  delete mongoose.models.SchoolAspirant;
}

const SchoolAspirant: Model<ISchoolAspirant> = mongoose.model<ISchoolAspirant>('SchoolAspirant', SchoolAspirantSchema);

export default SchoolAspirant;
