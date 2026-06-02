import mongoose, { Schema, Model } from 'mongoose';
import type { ISettings } from '@/types/models';

const SETTINGS_KEY = 'global';

const SettingsSchema = new Schema<ISettings>(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: SETTINGS_KEY,
    },
    organizationName: {
      type: String,
      trim: true,
      default: 'Waah Foundation',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: 'contact@waahfoundation.org',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    /** Map location keyframe: iframe embed or location snippet for the map */
    mapLocationKeyframe: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Settings: Model<ISettings> =
  mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
export { SETTINGS_KEY };
