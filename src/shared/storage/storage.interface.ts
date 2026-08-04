import { UploadResult } from "./storage.types.js";

export interface StorageService {
  upload(
    file: Express.Multer.File,
    folder: string
  ): Promise<UploadResult>;

  delete(
    fileUrl: string
  ): Promise<void>;
}