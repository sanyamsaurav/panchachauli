import mongoose, { Schema, Model } from 'mongoose';
import type { IBlog } from '@/types/models';

const BlogSchema = new Schema<IBlog>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [200, 'Title must not exceed 200 characters'],
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be URL-safe (lowercase, hyphens)'],
    },
    excerpt: {
      type: String,
      trim: true,
      maxlength: [500, 'Excerpt must not exceed 500 characters'],
    },
    contentHtml: {
      type: String,
      required: [true, 'Content HTML is required'],
    },
    coverImage: {
      type: String,
      trim: true,
    },
    author: {
      type: String,
      trim: true,
      default: 'Admin',
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    metaTitle: {
      type: String,
      trim: true,
      maxlength: [200, 'Meta title must not exceed 200 characters'],
    },
    metaDescription: {
      type: String,
      trim: true,
      maxlength: [300, 'Meta description must not exceed 300 characters'],
    },
    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Note: slug already has unique: true in schema definition, no need for separate index
BlogSchema.index({ status: 1, createdAt: -1 });
BlogSchema.index({ title: 'text', excerpt: 'text', metaTitle: 'text', metaDescription: 'text', tags: 'text' });

const Blog: Model<IBlog> =
  mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
