import { NextRequest, NextResponse } from "next/server";
import { imageUploadService } from "@/lib/services/image-upload-service";
import { productService } from "@/lib/services/database-service";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images") as File[];
    const productId = formData.get("productId") as string;

    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Product ID is required" },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: "No images provided" },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await productService.getProduct(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Upload images
    const imageUrls = await imageUploadService.uploadMultipleImages(
      files,
      productId
    );

    // Update product with new image URLs
    const existingImages = product.images || [];
    const updatedImages = [...existingImages, ...imageUrls];

    await productService.updateProduct(productId, {
      images: updatedImages,
      image: updatedImages[0], // Set first image as main image
    });

    return NextResponse.json({
      success: true,
      imageUrls,
      message: `Successfully uploaded ${imageUrls.length} image(s)`,
    });
  } catch (error) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to upload images",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const imageUrl = searchParams.get("imageUrl");

    if (!productId || !imageUrl) {
      return NextResponse.json(
        { success: false, error: "Product ID and image URL are required" },
        { status: 400 }
      );
    }

    // Verify product exists
    const product = await productService.getProduct(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Delete image from storage
    await imageUploadService.deleteImage(imageUrl);

    // Update product by removing the image URL
    const updatedImages = (product.images || []).filter(
      (url) => url !== imageUrl
    );

    await productService.updateProduct(productId, {
      images: updatedImages,
      image: updatedImages[0] || null, // Update main image
    });

    return NextResponse.json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Image deletion error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Failed to delete image",
      },
      { status: 500 }
    );
  }
}
