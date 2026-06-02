import axiosInterceptor from './axios.interceptor';
import { adminRoutes, publicRoutes, type SettingsUpdatePayload, type SettingsData } from './api.routes';
import type { PaginatedResponse } from '@/types/api';
import type { IVolunteer, IBlog, IExperience, IContact, ISchoolAspirant, IProduct } from '@/types/models';

export const getSettings = async () => {
  const response = await axiosInterceptor.get<{ success: boolean; message?: string; data: SettingsData }>(
    adminRoutes.settings()
  );
  return response.data;
};

export const updateSettings = async (body: SettingsUpdatePayload) => {
  const response = await axiosInterceptor.patch<{
    success: boolean;
    message?: string;
    data: SettingsData;
  }>(adminRoutes.settings(), body);
  return response.data;
};

export interface UpdatePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const updatePassword = async (body: UpdatePasswordPayload) => {
  const response = await axiosInterceptor.patch<{ success: boolean; message?: string }>(
    adminRoutes.password(),
    body
  );
  return response.data;
};

export interface AdminVolunteersParams {
  page?: number;
  limit?: number;
  search?: string;
  skills?: string[];
  isActive?: boolean;
}

export const getAdminVolunteers = async (
  params: AdminVolunteersParams = {}
): Promise<PaginatedResponse<IVolunteer>> => {
  const { page, limit, search, skills, isActive } = params;
  const response = await axiosInterceptor.get<PaginatedResponse<IVolunteer>>(adminRoutes.volunteers(), {
    params: {
      ...(page != null && { page }),
      ...(limit != null && { limit }),
      ...(search && { search }),
      ...(skills && skills.length > 0 && { skills: skills.join(',') }),
      ...(typeof isActive === 'boolean' && { isActive }),
    },
  });
  return response.data;
};

export interface AdminBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'published';
  tag?: string;
}

export const getAdminBlogs = async (
  params: AdminBlogsParams = {}
): Promise<PaginatedResponse<IBlog>> => {
  const { page, limit, search, status, tag } = params;
  const response = await axiosInterceptor.get<PaginatedResponse<IBlog>>(adminRoutes.blogs(), {
    params: {
      ...(page != null && { page }),
      ...(limit != null && { limit }),
      ...(search && { search }),
      ...(status && { status }),
      ...(tag && { tag }),
    },
  });
  return response.data;
};

export interface CreateBlogPayload {
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
  publishedAt?: string | null;
}

export const createAdminBlog = async (payload: CreateBlogPayload) => {
  const response = await axiosInterceptor.post<{ success: boolean; message?: string; data: IBlog; errors?: Record<string, string> }>(
    adminRoutes.blogs(),
    payload
  );
  return response.data;
};

export const uploadAdminImage = async (file: File) => {
  const form = new FormData();
  form.append('file', file);
  const response = await axiosInterceptor.post<{ success: boolean; message?: string; data?: { url: string; key?: string } }>(
    adminRoutes.upload(),
    form
    // Note: No headers specified - axios interceptor will remove Content-Type for FormData
    // This allows the browser to set the correct multipart/form-data with boundary
  );
  return response.data;
};

export const getAdminBlogById = async (id: string) => {
  const response = await axiosInterceptor.get<{ success: boolean; message?: string; data: IBlog }>(
    adminRoutes.blogs(id)
  );
  return response.data;
};

export const getAdminBlogBySlug = async (slug: string) => {
  const response = await axiosInterceptor.get<{ success: boolean; message?: string; data: IBlog }>(
    adminRoutes.blogBySlug(slug)
  );
  return response.data;
};

export const updateAdminBlog = async (id: string, payload: Partial<CreateBlogPayload>) => {
  const response = await axiosInterceptor.put<{ success: boolean; message?: string; data: IBlog; errors?: Record<string, string> }>(
    adminRoutes.blogs(id),
    payload
  );
  return response.data;
};

export const deleteAdminBlog = async (id: string) => {
  const response = await axiosInterceptor.delete<{ success: boolean; message?: string }>(
    adminRoutes.blogs(id)
  );
  return response.data;
};

// Experiences
export interface AdminExperiencesParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'published';
}

export const getAdminExperiences = async (
  params: AdminExperiencesParams = {}
): Promise<PaginatedResponse<IExperience>> => {
  const { page, limit, search, status } = params;
  const response = await axiosInterceptor.get<PaginatedResponse<IExperience>>(adminRoutes.experiences(), {
    params: {
      ...(page != null && { page }),
      ...(limit != null && { limit }),
      ...(search && { search }),
      ...(status && { status }),
    },
  });
  return response.data;
};

export interface CreateExperiencePayload {
  title: string;
  slug: string;
  image: string;
  date?: string;
  content: string;
  status?: 'draft' | 'published';
  order?: number;
}

export const createAdminExperience = async (payload: CreateExperiencePayload) => {
  const response = await axiosInterceptor.post<{ success: boolean; message?: string; data: IExperience }>(
    adminRoutes.experiences(),
    payload
  );
  return response.data;
};

export const getAdminExperienceById = async (id: string) => {
  const response = await axiosInterceptor.get<{ success: boolean; message?: string; data: IExperience }>(
    adminRoutes.experiences(id)
  );
  return response.data;
};

export const getAdminExperienceBySlug = async (slug: string) => {
  const response = await axiosInterceptor.get<{ success: boolean; message?: string; data: IExperience }>(
    adminRoutes.experienceBySlug(slug)
  );
  return response.data;
};

export const updateAdminExperience = async (id: string, payload: Partial<CreateExperiencePayload>) => {
  const response = await axiosInterceptor.put<{ success: boolean; message?: string; data: IExperience }>(
    adminRoutes.experiences(id),
    payload
  );
  return response.data;
};

export const deleteAdminExperience = async (id: string) => {
  const response = await axiosInterceptor.delete<{ success: boolean; message?: string }>(
    adminRoutes.experiences(id)
  );
  return response.data;
};

// Contacts (Admin)
export interface AdminContactsParams {
  page?: number;
  limit?: number;
  status?: 'new' | 'read' | 'replied' | 'archived';
  email?: string;
}

export const getAdminContacts = async (
  params: AdminContactsParams = {}
): Promise<PaginatedResponse<IContact>> => {
  const { page, limit, status, email } = params;
  const response = await axiosInterceptor.get<PaginatedResponse<IContact>>(adminRoutes.contacts(), {
    params: {
      ...(page != null && { page }),
      ...(limit != null && { limit }),
      ...(status && { status }),
      ...(email && { email }),
    },
  });
  return response.data;
};

export const deleteAdminContact = async (id: string) => {
  const response = await axiosInterceptor.delete<{ success: boolean; message?: string }>(
    adminRoutes.contacts(id)
  );
  return response.data;
};

// School Aspirants (Admin)
export interface AdminSchoolAspirantsParams {
  page?: number;
  limit?: number;
  status?: 'new' | 'contacted' | 'enrolled' | 'rejected';
  email?: string;
  name?: string;
}

export const getAdminSchoolAspirants = async (
  params: AdminSchoolAspirantsParams = {}
): Promise<PaginatedResponse<ISchoolAspirant>> => {
  const { page, limit, status, email, name } = params;
  const response = await axiosInterceptor.get<PaginatedResponse<ISchoolAspirant>>(adminRoutes.school(), {
    params: {
      ...(page != null && { page }),
      ...(limit != null && { limit }),
      ...(status && { status }),
      ...(email && { email }),
      ...(name && { name }),
    },
  });
  return response.data;
};

export const updateAdminSchoolAspirant = async (id: string, payload: { status?: string; notes?: string }) => {
  const response = await axiosInterceptor.patch<{ success: boolean; message?: string; data: ISchoolAspirant }>(
    adminRoutes.school(),
    { id, ...payload }
  );
  return response.data;
};

export const deleteAdminSchoolAspirant = async (id: string) => {
  const response = await axiosInterceptor.delete<{ success: boolean; message?: string }>(
    adminRoutes.school(id)
  );
  return response.data;
};

// Products (Admin)
export interface AdminProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: 'draft' | 'published';
}

export const getAdminProducts = async (
  params: AdminProductsParams = {}
): Promise<PaginatedResponse<IProduct>> => {
  const { page, limit, search, status } = params;
  const response = await axiosInterceptor.get<PaginatedResponse<IProduct>>(adminRoutes.products(), {
    params: {
      ...(page != null && { page }),
      ...(limit != null && { limit }),
      ...(search && { search }),
      ...(status && { status }),
    },
  });
  return response.data;
};

export interface CreateProductPayload {
  title: string;
  slug: string;
  category: string;
  price: string;
  image: string;
  description?: string;
  features?: string[];
  hero?: { title: string; subtitle: string; image: string };
  section2?: { title: string; description: string; image: string };
  section3?: { title: string; description: string; image: string };
  status?: 'draft' | 'published';
  order?: number;
}

export const createAdminProduct = async (payload: CreateProductPayload) => {
  const response = await axiosInterceptor.post<{ success: boolean; message?: string; data: IProduct }>(
    adminRoutes.products(),
    payload
  );
  return response.data;
};

export const getAdminProductById = async (id: string) => {
  const response = await axiosInterceptor.get<{ success: boolean; message?: string; data: IProduct }>(
    adminRoutes.products(id)
  );
  return response.data;
};

export const updateAdminProduct = async (id: string, payload: Partial<CreateProductPayload>) => {
  const response = await axiosInterceptor.put<{ success: boolean; message?: string; data: IProduct }>(
    adminRoutes.products(id),
    payload
  );
  return response.data;
};

export const deleteAdminProduct = async (id: string) => {
  const response = await axiosInterceptor.delete<{ success: boolean; message?: string }>(
    adminRoutes.products(id)
  );
  return response.data;
};

// Public Blog APIs
export interface GetBlogsParams {
  page?: number;
  limit?: number;
  search?: string;
  tag?: string;
}

export const getBlogs = async (params: GetBlogsParams = {}): Promise<PaginatedResponse<IBlog>> => {
  const { page, limit, search, tag } = params;
  const response = await axiosInterceptor.get<PaginatedResponse<IBlog>>(publicRoutes.blogs(), {
    params: {
      ...(page != null && { page }),
      ...(limit != null && { limit }),
      ...(search && { search }),
      ...(tag && { tag }),
    },
  });
  return response.data;
};

export const getBlogBySlug = async (slug: string) => {
  const response = await axiosInterceptor.get<{ success: boolean; message?: string; data: IBlog }>(
    publicRoutes.blogBySlug(slug)
  );
  return response.data;
};

// Public Experience APIs
export const getExperiences = async (params: { page?: number; limit?: number; search?: string } = {}): Promise<PaginatedResponse<IExperience>> => {
  const { page, limit, search } = params;
  const response = await axiosInterceptor.get<PaginatedResponse<IExperience>>(publicRoutes.experiences(), {
    params: {
      ...(page != null && { page }),
      ...(limit != null && { limit }),
      ...(search && { search }),
    },
  });
  return response.data;
};

export const getExperienceBySlug = async (slug: string) => {
  const response = await axiosInterceptor.get<{ success: boolean; message?: string; data: IExperience }>(
    publicRoutes.experienceBySlug(slug)
  );
  return response.data;
};

// Public Product APIs
export interface GetProductsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const getProducts = async (params: GetProductsParams = {}): Promise<PaginatedResponse<IProduct>> => {
  const { page, limit, search } = params;
  const response = await axiosInterceptor.get<PaginatedResponse<IProduct>>(publicRoutes.products(), {
    params: {
      ...(page != null && { page }),
      ...(limit != null && { limit }),
      ...(search && { search }),
    },
  });
  return response.data;
};

export const getProductBySlug = async (slug: string) => {
  const response = await axiosInterceptor.get<{ success: boolean; message?: string; data: IProduct }>(
    publicRoutes.productBySlug(slug)
  );
  return response.data;
};

// Public Settings API
export interface PublicSettings {
  organizationName: string;
  email: string;
  phone: string;
  address: string;
  mapLocationKeyframe: string;
}

export const getPublicSettings = async () => {
  const response = await axiosInterceptor.get<{ success: boolean; message?: string; data: PublicSettings }>(
    publicRoutes.settings()
  );
  return response.data;
};
