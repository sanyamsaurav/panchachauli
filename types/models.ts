import { Document, Types } from 'mongoose';

export interface IUser extends Document {
  _id: Types.ObjectId;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'volunteer' | 'user';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAdmin extends IUser {
  role: 'admin';
  permissions?: string[];
}

export interface IVolunteer extends IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  skills: string[];
  availability: string[];
  status: 'active' | 'pending' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface IDonation extends Document {
  _id: Types.ObjectId;
  donorName: string;
  donorEmail: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled';
  paymentId?: string;
  volunteerId?: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContact extends Document {
  _id: Types.ObjectId;
  fullName: string;
  mobileNumber: string;
  email?: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

/** Singleton app settings (one document with key 'global') */
export interface ISettings extends Document {
  _id: Types.ObjectId;
  key: string;
  organizationName: string;
  email: string;
  phone: string;
  address: string;
  /** Map location keyframe: iframe embed code or location snippet for the map */
  mapLocationKeyframe: string;
  updatedAt: Date;
}

export interface IBlog extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  excerpt?: string;
  contentHtml: string;
  coverImage?: string;
  author?: string;
  tags: string[];
  status: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExperience extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  image: string;
  date?: string;
  content: string;
  status: 'draft' | 'published';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISchoolAspirant extends Document {
  _id: Types.ObjectId;
  name: string;
  location: string;
  email: string;
  phone: string;
  message: string;
  status: 'new' | 'contacted' | 'enrolled' | 'rejected';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  category: string;
  price: string;
  image: string; // Used for the list/card view
  description?: string;
  features?: string[];
  hero: {
    title: string;
    subtitle: string;
    image: string;
  };
  section2: {
    title: string;
    description: string;
    image: string;
  };
  section3: {
    title: string;
    description: string;
    image: string;
  };
  status: 'draft' | 'published';
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
