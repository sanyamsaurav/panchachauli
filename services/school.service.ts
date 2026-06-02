import connectDB from '@/lib/db/mongodb';
import { SchoolAspirant } from '@/models';
import type { ISchoolAspirant } from '@/types/models';
import type { PaginatedResponse } from '@/types/api';
import { PAGINATION } from '@/constants';

export interface GetSchoolAspirantsParams {
  page?: number;
  limit?: number;
  status?: 'new' | 'contacted' | 'enrolled' | 'rejected';
  email?: string;
  name?: string;
}

export interface CreateSchoolAspirantData {
  name: string;
  location: string;
  email: string;
  phone: string;
  message: string;
}

export interface UpdateSchoolAspirantData {
  status?: 'new' | 'contacted' | 'enrolled' | 'rejected';
  notes?: string;
}

/**
 * Service for school aspirant operations
 */
export class SchoolService {
  /**
   * Get all school aspirants with pagination
   */
  static async getAspirants(params: GetSchoolAspirantsParams = {}): Promise<PaginatedResponse<ISchoolAspirant>> {
    await connectDB();

    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      status,
      email,
      name,
    } = params;

    const skip = (page - 1) * limit;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (email) {
      query.email = { $regex: email.toLowerCase().trim(), $options: 'i' };
    }

    if (name) {
      query.name = { $regex: name.trim(), $options: 'i' };
    }

    const aspirants = await SchoolAspirant.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SchoolAspirant.countDocuments(query);

    return {
      success: true,
      data: aspirants,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get aspirant by ID
   */
  static async getAspirantById(aspirantId: string): Promise<ISchoolAspirant | null> {
    await connectDB();

    const aspirant = await SchoolAspirant.findById(aspirantId);
    return aspirant;
  }

  /**
   * Create a new school aspirant inquiry
   */
  static async createAspirant(data: CreateSchoolAspirantData): Promise<ISchoolAspirant> {
    await connectDB();

    const aspirant = await SchoolAspirant.create({
      name: data.name.trim(),
      location: data.location.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      message: data.message.trim(),
      status: 'new',
    });

    return aspirant;
  }

  /**
   * Update aspirant status and notes
   */
  static async updateAspirant(
    aspirantId: string,
    data: UpdateSchoolAspirantData
  ): Promise<ISchoolAspirant | null> {
    await connectDB();

    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes?.trim();

    const aspirant = await SchoolAspirant.findByIdAndUpdate(
      aspirantId,
      updateData,
      { new: true, runValidators: true }
    );

    return aspirant;
  }

  /**
   * Get aspirants by email
   */
  static async getAspirantsByEmail(email: string): Promise<ISchoolAspirant[]> {
    await connectDB();

    const aspirants = await SchoolAspirant.find({ email: email.toLowerCase().trim() })
      .sort({ createdAt: -1 });

    return aspirants;
  }

  /**
   * Get new aspirants count
   */
  static async getNewCount(): Promise<number> {
    await connectDB();

    const count = await SchoolAspirant.countDocuments({ status: 'new' });
    return count;
  }

  /**
   * Permanently delete an aspirant
   */
  static async deleteAspirant(aspirantId: string): Promise<ISchoolAspirant | null> {
    await connectDB();

    const deleted = await SchoolAspirant.findByIdAndDelete(aspirantId);
    return deleted;
  }
}
