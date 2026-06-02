import connectDB from '@/lib/db/mongodb';
import { Contact } from '@/models';
import type { IContact } from '@/types/models';
import type { PaginatedResponse } from '@/types/api';
import { PAGINATION } from '@/constants';

export interface GetContactsParams {
  page?: number;
  limit?: number;
  status?: 'new' | 'read' | 'replied' | 'archived';
  email?: string;
}

export interface CreateContactData {
  fullName: string;
  mobileNumber: string;
  email?: string;
  message: string;
}

/**
 * Service for contact operations
 */
export class ContactService {
  /**
   * Get all contacts with pagination
   */
  static async getContacts(params: GetContactsParams = {}): Promise<PaginatedResponse<IContact>> {
    await connectDB();

    const {
      page = PAGINATION.DEFAULT_PAGE,
      limit = PAGINATION.DEFAULT_LIMIT,
      status,
      email,
    } = params;

    const skip = (page - 1) * limit;
    const query: any = {};

    if (status) {
      query.status = status;
    }

    if (email) {
      query.email = email.toLowerCase().trim();
    }

    const contacts = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    return {
      success: true,
      data: contacts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get contact by ID
   */
  static async getContactById(contactId: string): Promise<IContact | null> {
    await connectDB();

    const contact = await Contact.findById(contactId);
    return contact;
  }

  /**
   * Create a new contact message
   */
  static async createContact(data: CreateContactData): Promise<IContact> {
    await connectDB();

    const contact = await Contact.create({
      fullName: data.fullName.trim(),
      mobileNumber: data.mobileNumber.trim(),
      message: data.message.trim(),
      email: data.email?.trim().toLowerCase() || undefined,
      status: 'new',
    });

    return contact;
  }

  /**
   * Update contact status
   */
  static async updateContactStatus(
    contactId: string,
    status: 'new' | 'read' | 'replied' | 'archived'
  ): Promise<IContact | null> {
    await connectDB();

    const contact = await Contact.findByIdAndUpdate(
      contactId,
      { status },
      { new: true, runValidators: true }
    );

    return contact;
  }

  /**
   * Get contacts by email
   */
  static async getContactsByEmail(email: string): Promise<IContact[]> {
    await connectDB();

    const contacts = await Contact.find({ email: email.toLowerCase().trim() })
      .sort({ createdAt: -1 });

    return contacts;
  }

  /**
   * Get unread contacts count
   */
  static async getUnreadCount(): Promise<number> {
    await connectDB();

    const count = await Contact.countDocuments({ status: 'new' });
    return count;
  }

  /**
   * Permanently delete a contact message
   */
  static async deleteContact(contactId: string): Promise<IContact | null> {
    await connectDB();

    const deleted = await Contact.findByIdAndDelete(contactId);
    return deleted;
  }
}

