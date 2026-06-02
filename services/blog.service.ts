import connectDB from '@/lib/db/mongodb';
import { Blog } from '@/models';
import type { IBlog } from '@/types/models';
import type { PaginatedResponse } from '@/types/api';
import { PAGINATION } from '@/constants';

export interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'published';
  tag?: string;
}

export interface CreateBlogData {
  title: string;
  slug: string;
  excerpt?: string;
  contentHtml: string;
  coverImage?: string;
  author?: string;
  tags?: string[];
  status?: 'draft' | 'published';
  metaTitle?: string;
  metaDescription?: string;
  publishedAt?: Date | null;
}

export type UpdateBlogData = Partial<CreateBlogData>;

export class BlogService {
  static async getBlogs(params: GetBlogsParams = {}): Promise<PaginatedResponse<IBlog>> {
    await connectDB();

    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      search,
      status,
      tag,
    } = params;

    const skip = (page - 1) * limit;
    const query: Record<string, unknown> = {};

    if (status) query.status = status;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { metaTitle: { $regex: search, $options: 'i' } },
        { metaDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    return {
      success: true,
      data: blogs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string): Promise<IBlog | null> {
    await connectDB();
    return Blog.findById(id);
  }

  static async getBySlug(slug: string): Promise<IBlog | null> {
    await connectDB();
    return Blog.findOne({ slug });
  }

  static async create(data: CreateBlogData): Promise<IBlog> {
    await connectDB();

    const exists = await Blog.findOne({ slug: data.slug });
    if (exists) {
      throw new Error('Blog with this slug already exists');
    }

    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }

    const blog = await Blog.create({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      contentHtml: data.contentHtml,
      coverImage: data.coverImage,
      author: data.author,
      tags: data.tags ?? [],
      status: data.status ?? 'draft',
      metaTitle: data.metaTitle ?? data.title,
      metaDescription: data.metaDescription ?? data.excerpt,
      publishedAt: data.publishedAt ?? null,
    });

    return blog;
  }

  static async update(id: string, data: UpdateBlogData): Promise<IBlog | null> {
    await connectDB();

    if (data.slug) {
      const exists = await Blog.findOne({ slug: data.slug, _id: { $ne: id } });
      if (exists) {
        throw new Error('Another blog with this slug already exists');
      }
    }

    if (data.status === 'published' && !data.publishedAt) {
      data.publishedAt = new Date();
    }
    if (data.status === 'draft') {
      data.publishedAt = null;
    }

    const blog = await Blog.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );
    return blog;
  }

  static async remove(id: string): Promise<void> {
    await connectDB();
    await Blog.findByIdAndDelete(id);
  }
}
