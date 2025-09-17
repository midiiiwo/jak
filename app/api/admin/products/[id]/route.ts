import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/lib/services/database-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await productService.getProduct(id);

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Get product error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch product",
      },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updateData = await request.json();

    // TODO: Get admin user from JWT token
    const adminUser = "admin";

    const updatedProduct = await productService.updateProduct(id, {
      ...updateData,
      updatedBy: adminUser,
    });

    return NextResponse.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Update product error:", error);
    if (error instanceof Error && error.message.includes("not found")) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: false,
        error: "Failed to update product",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if product exists first
    const product = await productService.getProduct(id);
    if (!product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 }
      );
    }

    // Soft delete (set isActive to false)
    await productService.deleteProduct(id);

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Delete product error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete product",
      },
      { status: 500 }
    );
  }
}
