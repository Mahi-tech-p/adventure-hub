import { UploadOptions, UploadResult } from "./storage.types.js";

export interface StorageService {
  upload(options: UploadOptions): Promise<UploadResult>;

  delete(publicId: string): Promise<void>;
}