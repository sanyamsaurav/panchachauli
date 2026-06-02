import mongoose, { Schema, Model } from 'mongoose';
import type { IVolunteer } from '@/types/models';

const VolunteerSchema = new Schema<IVolunteer>(
  {
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      enum: ['volunteer'],
      default: 'volunteer',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    availability: {
      type: [String],
      default: [],
      enum: ['weekdays', 'weekends', 'mornings', 'afternoons', 'evenings'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
// Note: email index is automatically created by unique: true, so we don't need to add it manually
VolunteerSchema.index({ role: 1 });

VolunteerSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const Volunteer: Model<IVolunteer> =
  mongoose.models.Volunteer || mongoose.model<IVolunteer>('Volunteer', VolunteerSchema);

export default Volunteer;

