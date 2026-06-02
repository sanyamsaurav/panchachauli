import connectDB from '@/lib/db/mongodb';
import { Experience } from '@/models';
import type { IExperience } from '@/types/models';
import type { PaginatedResponse } from '@/types/api';
import { PAGINATION } from '@/constants';

export interface GetExperiencesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'published';
}

export interface CreateExperienceData {
  title: string;
  slug: string;
  image: string;
  date?: string;
  content: string;
  status?: 'draft' | 'published';
  order?: number;
}

export type UpdateExperienceData = Partial<CreateExperienceData>;

export class ExperienceService {
  static async getExperiences(params: GetExperiencesParams = {}): Promise<PaginatedResponse<IExperience>> {
    await connectDB();

    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      search,
      status,
    } = params;

    const skip = (page - 1) * limit;
    const query: Record<string, unknown> = {};

    if (status) query.status = status;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const experiences = await Experience.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Experience.countDocuments(query);

    return {
      success: true,
      data: experiences,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string): Promise<IExperience | null> {
    await connectDB();
    return Experience.findById(id);
  }

  static async getBySlug(slug: string): Promise<IExperience | null> {
    await connectDB();
    return Experience.findOne({ slug });
  }

  static async create(data: CreateExperienceData): Promise<IExperience> {
    await connectDB();

    const exists = await Experience.findOne({ slug: data.slug });
    if (exists) {
      throw new Error('Experience with this slug already exists');
    }

    const experience = await Experience.create({
      title: data.title,
      slug: data.slug,
      image: data.image,
      date: data.date,
      content: data.content,
      status: data.status ?? 'published',
      order: data.order ?? 0,
    });

    return experience;
  }

  static async update(id: string, data: UpdateExperienceData): Promise<IExperience | null> {
    await connectDB();

    if (data.slug) {
      const exists = await Experience.findOne({ slug: data.slug, _id: { $ne: id } });
      if (exists) {
        throw new Error('Another experience with this slug already exists');
      }
    }

    const experience = await Experience.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    return experience;
  }

  static async remove(id: string): Promise<void> {
    await connectDB();
    await Experience.findByIdAndDelete(id);
  }
}
