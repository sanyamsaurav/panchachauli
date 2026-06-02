import connectDB from '@/lib/db/mongodb';
import Settings, { SETTINGS_KEY } from '@/models/Settings';
import type { ISettings } from '@/types/models';

export interface SettingsUpdateData {
  organizationName?: string;
  email?: string;
  phone?: string;
  address?: string;
  mapLocationKeyframe?: string;
}

const DEFAULT_SETTINGS: SettingsUpdateData = {
  organizationName: 'Waah Foundation',
  email: 'contact@waahfoundation.org',
  phone: '',
  address: '',
  mapLocationKeyframe: '',
};

/**
 * Get app settings (singleton). Creates document with defaults if none exists.
 */
export async function getSettings(): Promise<ISettings> {
  await connectDB();

  const settings = await Settings.findOne({ key: SETTINGS_KEY }).lean();

  if (!settings) {
    const created = await Settings.create({
      key: SETTINGS_KEY,
      ...DEFAULT_SETTINGS,
    });
    return created.toObject() as ISettings;
  }

  return settings as ISettings;
}

/**
 * Update app settings (admin only). Partial update.
 */
export async function updateSettings(data: SettingsUpdateData): Promise<ISettings> {
  await connectDB();

  const updated = await Settings.findOneAndUpdate(
    { key: SETTINGS_KEY },
    {
      $set: {
        ...(data.organizationName !== undefined && { organizationName: data.organizationName.trim() }),
        ...(data.email !== undefined && { email: data.email.trim().toLowerCase() }),
        ...(data.phone !== undefined && { phone: data.phone.trim() }),
        ...(data.address !== undefined && { address: data.address.trim() }),
        ...(data.mapLocationKeyframe !== undefined && { mapLocationKeyframe: data.mapLocationKeyframe.trim() }),
      },
    },
    { new: true, runValidators: true, upsert: true }
  );

  if (!updated) {
    const created = await Settings.create({ key: SETTINGS_KEY, ...DEFAULT_SETTINGS, ...data });
    return created.toObject() as ISettings;
  }

  return updated.toObject() as ISettings;
}
