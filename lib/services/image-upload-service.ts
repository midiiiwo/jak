import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  listAll,
} from "firebase/storage";
import { app } from "@/lib/firebase/firebase";

const storage = getStorage(app);

export class ImageUploadService {
  private basePath = "products";

  /**
   * Upload a single image file
   */
  async uploadImage(
    file: File,
    productId: string,
    imageIndex: number = 0
  ): Promise<string> {
    try {
      // Validate file type
      if (!this.isValidImageFile(file)) {
        throw new Error(
          "Invalid file type. Only JPEG, PNG, and WebP are allowed."
        );
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size too large. Maximum size is 5MB.");
      }

      // Generate unique filename
      const fileName = this.generateFileName(file, productId, imageIndex);
      const imageRef = ref(
        storage,
        `${this.basePath}/${productId}/${fileName}`
      );

      // Upload file
      const snapshot = await uploadBytes(imageRef, file);

      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref);

      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }

  /**
   * Upload multiple images for a product
   */
  async uploadMultipleImages(
    files: File[],
    productId: string
  ): Promise<string[]> {
    const uploadPromises = files.map((file, index) =>
      this.uploadImage(file, productId, index)
    );

    try {
      return await Promise.all(uploadPromises);
    } catch (error) {
      console.error("Error uploading multiple images:", error);
      throw error;
    }
  }

  /**
   * Delete an image
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extract path from URL
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  }

  /**
   * Delete all images for a product
   */
  async deleteProductImages(productId: string): Promise<void> {
    try {
      const folderRef = ref(storage, `${this.basePath}/${productId}`);
      const listResult = await listAll(folderRef);

      const deletePromises = listResult.items.map((imageRef) =>
        deleteObject(imageRef)
      );

      await Promise.all(deletePromises);
    } catch (error) {
      console.error("Error deleting product images:", error);
      throw error;
    }
  }

  /**
   * Replace an existing image
   */
  async replaceImage(
    file: File,
    productId: string,
    oldImageUrl: string,
    imageIndex: number = 0
  ): Promise<string> {
    try {
      // Delete old image
      await this.deleteImage(oldImageUrl);

      // Upload new image
      return await this.uploadImage(file, productId, imageIndex);
    } catch (error) {
      console.error("Error replacing image:", error);
      throw error;
    }
  }

  /**
   * Get all images for a product
   */
  async getProductImages(productId: string): Promise<string[]> {
    try {
      const folderRef = ref(storage, `${this.basePath}/${productId}`);
      const listResult = await listAll(folderRef);

      const urlPromises = listResult.items.map((imageRef) =>
        getDownloadURL(imageRef)
      );

      return await Promise.all(urlPromises);
    } catch (error) {
      console.error("Error getting product images:", error);
      throw error;
    }
  }

  /**
   * Validate if file is a valid image
   */
  private isValidImageFile(file: File): boolean {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    return allowedTypes.includes(file.type);
  }

  /**
   * Generate unique filename
   */
  private generateFileName(
    file: File,
    productId: string,
    imageIndex: number
  ): string {
    const timestamp = Date.now();
    const extension = file.name.split(".").pop();
    return `${productId}_${imageIndex}_${timestamp}.${extension}`;
  }

  /**
   * Resize and compress image (for future implementation)
   */
  async compressImage(file: File, maxWidth: number = 800): Promise<File> {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions
        const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
        canvas.width = img.width * ratio;
        canvas.height = img.height * ratio;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: file.type,
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              reject(new Error("Failed to compress image"));
            }
          },
          file.type,
          0.8 // 80% quality
        );
      };

      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = URL.createObjectURL(file);
    });
  }
}

export const imageUploadService = new ImageUploadService();
