import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3Client, s3Config, getS3PublicUrl, validateS3Config } from './config';
import path from 'path';

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

// Allowed image types
const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
];

// Max file size: 10MB
const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * Generate a unique filename for S3
 */
function generateUniqueFilename(originalName: string): string {
  const ext = path.extname(originalName) || '';
  const base = path.basename(originalName, ext)
    .toLowerCase()
    .replace(/[^a-z0-9\-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `uploads/${timestamp}-${random}-${base}${ext}`;
}

/**
 * Validate file before upload
 */
function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `Invalid file type. Allowed types: ${ALLOWED_TYPES.join(', ')}` 
    };
  }
  
  if (file.size > MAX_FILE_SIZE) {
    return { 
      valid: false, 
      error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` 
    };
  }
  
  return { valid: true };
}

/**
 * Upload a file to S3
 */
export async function uploadToS3(file: File): Promise<UploadResult> {
  try {
    // Validate S3 configuration
    const configCheck = validateS3Config();
    if (!configCheck.valid) {
      return { success: false, error: configCheck.error };
    }

    // Validate file
    const fileCheck = validateFile(file);
    if (!fileCheck.valid) {
      return { success: false, error: fileCheck.error };
    }

    // Generate unique key (filename in S3)
    const key = generateUniqueFilename(file.name);

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to S3
    const command = new PutObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      // Make the object publicly readable
    //   ACL: 'public-read',
    });

    await s3Client.send(command);

    // Get the public URL
    const url = getS3PublicUrl(key);

    return {
      success: true,
      url,
      key,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed';
    console.error('S3 Upload Error:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Delete a file from S3
 */
export async function deleteFromS3(key: string): Promise<{ success: boolean; error?: string }> {
  try {
    // Validate S3 configuration
    const configCheck = validateS3Config();
    if (!configCheck.valid) {
      return { success: false, error: configCheck.error };
    }

    const command = new DeleteObjectCommand({
      Bucket: s3Config.bucketName,
      Key: key,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Delete failed';
    console.error('S3 Delete Error:', error);
    return { success: false, error: errorMessage };
  }
}

/**
 * Extract S3 key from a full S3 URL
 */
export function extractS3KeyFromUrl(url: string): string | null {
  // Handle standard S3 URL format: https://bucket.s3.region.amazonaws.com/key
  const standardMatch = url.match(/\.s3\.[\w-]+\.amazonaws\.com\/(.+)$/);
  if (standardMatch) {
    return standardMatch[1];
  }
  
  // Handle custom endpoint format: https://endpoint/bucket/key
  if (s3Config.endpoint) {
    const customMatch = url.replace(`${s3Config.endpoint}/${s3Config.bucketName}/`, '');
    if (customMatch !== url) {
      return customMatch;
    }
  }
  
  return null;
}
