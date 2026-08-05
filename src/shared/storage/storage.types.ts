export interface UploadOptions {
  file: Express.Multer.File;
  folder: string;
  fileName?: string;
}

export interface UploadResult {
  url: string;
  publicId: string;
}