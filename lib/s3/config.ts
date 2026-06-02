import { S3Client } from '@aws-sdk/client-s3';

// S3 Configuration
export const s3Config = {
  region: process.env.NEXT_AWS_REGION || 'us-east-1',
  bucketName: process.env.NEXT_AWS_S3_BUCKET_NAME || '',
  accessKeyId: process.env.NEXT_AWS_ACCESS_KEY_ID || '',
  secretAccessKey: process.env.NEXT_AWS_SECRET_ACCESS_KEY || '',
  endpoint: process.env.AWS_S3_ENDPOINT || undefined, // For custom S3-compatible services like MinIO, DigitalOcean Spaces
  forcePathStyle: process.env.AWS_S3_FORCE_PATH_STYLE === 'true', // Needed for MinIO and some S3-compatible services
};

// Validate S3 configuration
export function validateS3Config(): { valid: boolean; error?: string } {
  if (!s3Config.bucketName) {
    return { valid: false, error: 'AWS_S3_BUCKET_NAME is not configured' };
  }
  if (!s3Config.accessKeyId) {
    return { valid: false, error: 'AWS_ACCESS_KEY_ID is not configured' };
  }
  if (!s3Config.secretAccessKey) {
    return { valid: false, error: 'AWS_SECRET_ACCESS_KEY is not configured' };
  }
  return { valid: true };
}

// Create S3 client
export const s3Client = new S3Client({
  region: s3Config.region,
  credentials: {
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey,
  },
  ...(s3Config.endpoint && { endpoint: s3Config.endpoint }),
  ...(s3Config.forcePathStyle && { forcePathStyle: s3Config.forcePathStyle }),
});

// Get public URL for an S3 object
export function getS3PublicUrl(key: string): string {
  if (s3Config.endpoint) {
    // For custom endpoints (MinIO, DigitalOcean Spaces, etc.)
    return `${s3Config.endpoint}/${s3Config.bucketName}/${key}`;
  }
  // Standard AWS S3 URL
  return `https://${s3Config.bucketName}.s3.${s3Config.region}.amazonaws.com/${key}`;
}
