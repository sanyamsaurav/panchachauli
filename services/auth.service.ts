import connectDB from '@/lib/db/mongodb';
import { hashPassword, comparePassword } from '@/lib/auth';
import { generateToken } from '@/lib/auth/jwt';
import { User, Admin, Volunteer } from '@/models';
import type { LoginRequest, RegisterRequest, AuthResponse } from '@/types/auth';
import { MESSAGES, ROLES, PAGINATION } from '@/constants';

/**
 * Service for authentication operations
 */
export class AuthService {
  /**
   * Login user with email and password
   */
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    await connectDB();

    const { email, password } = credentials;

    // Try to find user in different collections based on role
    let user: any = await User.findOne({ email }).select('+password');
    
    if (!user) {
      user = await Admin.findOne({ email }).select('+password');
    }
    
    if (!user) {
      user = await Volunteer.findOne({ email }).select('+password');
    }

    if (!user) {
      throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (!user.isActive) {
      throw new Error(MESSAGES.AUTH.ACCOUNT_DEACTIVATED);
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userData = user.toJSON();

    return {
      success: true,
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      token,
      user: {
        id: userData._id.toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
    };
  }

  /**
   * Register a new user or volunteer
   */
  static async register(data: RegisterRequest & { phone?: string; address?: string; skills?: string[]; availability?: string[] }): Promise<AuthResponse> {
    await connectDB();

    const { email, password, name, role = 'user', phone, address, skills, availability } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    const existingVolunteer = await Volunteer.findOne({ email });
    const existingAdmin = await Admin.findOne({ email });

    if (existingUser || existingVolunteer || existingAdmin) {
      throw new Error(MESSAGES.AUTH.USER_EXISTS);
    }

    const hashedPassword = await hashPassword(password);

    let user;
    if (role === ROLES.VOLUNTEER) {
      const volunteerData: any = {
        email,
        password: hashedPassword,
        name,
        role: ROLES.VOLUNTEER,
      };
      
      if (phone && phone.trim()) {
        volunteerData.phone = phone.trim();
      }
      if (address && address.trim()) {
        volunteerData.address = address.trim();
      }
      if (skills && skills.length > 0) {
        volunteerData.skills = skills;
      }
      if (availability && availability.length > 0) {
        volunteerData.availability = availability;
      }
      
      user = await Volunteer.create(volunteerData);
    } else {
      user = await User.create({
        email,
        password: hashedPassword,
        name,
        role: ROLES.USER,
      });
    }

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const userData = user.toJSON();

    return {
      success: true,
      message: MESSAGES.AUTH.REGISTER_SUCCESS,
      token,
      user: {
        id: userData._id.toString(),
        email: userData.email,
        name: userData.name,
        role: userData.role,
      },
    };
  }

  /**
   * Admin-only login: validate credentials against Admin collection only.
   * Used by NextAuth Credentials provider for admin dashboard.
   */
  static async adminLogin(credentials: LoginRequest): Promise<AuthResponse> {
    await connectDB();

    const { email, password } = credentials;

    const admin = await Admin.findOne({ email }).select('+password');

    console.log(admin,"adminsdsdsd");
    if (!admin) {
      throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    if (!admin.isActive) {
      throw new Error(MESSAGES.AUTH.ACCOUNT_DEACTIVATED);
    }

    const isPasswordValid = await comparePassword(password, admin.password);
    console.log(isPasswordValid,admin.password,"isPasswordValidddddfsafdsfsdfdsfdsf");
    if (!isPasswordValid) {
      throw new Error(MESSAGES.AUTH.INVALID_CREDENTIALS);
    }

    const adminData = admin.toJSON();
    return {
      success: true,
      message: MESSAGES.AUTH.LOGIN_SUCCESS,
      user: {
        id: adminData._id.toString(),
        email: adminData.email,
        name: adminData.name,
        role: adminData.role,
      },
    };
    
  }

  /**
   * Update admin password (current password required).
   */
  static async updateAdminPassword(
    adminId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    await connectDB();

    const admin = await Admin.findById(adminId).select('+password');
    if (!admin) {
      throw new Error(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    const isValid = await comparePassword(currentPassword, admin.password);
    if (!isValid) {
      throw new Error(MESSAGES.AUTH.CURRENT_PASSWORD_INVALID);
    }

    admin.password = await hashPassword(newPassword);
    await admin.save();
  }

  /**
   * Verify token and get user data
   */
  static async verifyToken(userId: string): Promise<AuthResponse['user']> {
    await connectDB();

    // Fetch user from appropriate collection
    let user = await User.findById(userId);
    
    if (!user) {
      user = await Admin.findById(userId);
    }
    
    if (!user) {
      user = await Volunteer.findById(userId);
    }

    if (!user) {
      throw new Error(MESSAGES.AUTH.USER_NOT_FOUND);
    }

    if (!user.isActive) {
      throw new Error(MESSAGES.AUTH.ACCOUNT_DEACTIVATED);
    }

    const userData = user.toJSON();

    return {
      id: userData._id.toString(),
      email: userData.email,
      name: userData.name,
      role: userData.role,
    };
  }
}

