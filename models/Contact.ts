import mongoose, { Schema, Model } from 'mongoose';
import type { IContact } from '@/types/models';

const ContactSchema = new Schema<IContact>(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      maxlength: [100, 'Full name must not exceed 100 characters'],
    },
    mobileNumber: {
      type: String,
      required: [true, 'Mobile number is required'],
      trim: true,
      match: [/^\+?[0-9]{10,15}$/, 'Mobile number must be 10-15 digits'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [2000, 'Message must not exceed 2000 characters'],
    },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });
ContactSchema.index({ email: 1 });

if (mongoose.models.Contact) {
  delete mongoose.models.Contact;
}

const Contact: Model<IContact> = mongoose.model<IContact>('Contact', ContactSchema);

export default Contact;

