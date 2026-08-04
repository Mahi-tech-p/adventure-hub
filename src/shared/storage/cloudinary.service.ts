import { Readable } from "stream";
import cloudinary from "./cloudinary.js";
import {
  StorageService,
} from "./storage.interface.js";
import { UploadResult } from "./storage.types.js";

class CloudinaryStorageService implements StorageService {
  async upload(
    file: Express.Multer.File,
    folder: string
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error || !result) {
            return reject(error);
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }

  async delete(publicId: string): Promise<void> {
    await cloudinary.uploader.destroy(publicId);
  }
}

export const storageService =
  new CloudinaryStorageService();