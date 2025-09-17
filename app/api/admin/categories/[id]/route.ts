import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/lib/services/database-service";

// GET - Fetch single category
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categories = await categoryService.getCategories(false);
    const category = categories.find((cat) => cat.id === id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, description, isActive, sortOrder, image } = body;

    // Check if category exists
    const existingCategories = await categoryService.getCategories(false);
    const categoryExists = existingCategories.find((cat) => cat.id === id);

    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // Check if another category has the same name
    if (name) {
      const nameConflict = existingCategories.find(
        (cat) => cat.id !== id && cat.name.toLowerCase() === name.toLowerCase()
      );

      if (nameConflict) {
        return NextResponse.json(
          { success: false, error: "Category with this name already exists" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description.trim();
    if (isActive !== undefined) updateData.isActive = isActive;
    if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
    if (image !== undefined) updateData.image = image;

    const updatedCategory = await categoryService.updateCategory(
      id,
      updateData
    );

    return NextResponse.json({
      success: true,
      category: updatedCategory,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// PATCH - Partial update (e.g., toggle status)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if category exists
    const existingCategories = await categoryService.getCategories(false);
    const categoryExists = existingCategories.find((cat) => cat.id === id);

    if (!categoryExists) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    const updatedCategory = await categoryService.updateCategory(id, body);

    return NextResponse.json({
      success: true,
      category: updatedCategory,
      message: "Category updated successfully",
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE - Delete category (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Check if category exists
    const existingCategories = await categoryService.getCategories(false);
    const category = existingCategories.find((cat) => cat.id === id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category not found" },
        { status: 404 }
      );
    }

    // TODO: Check if category has products
    // This would require a productService method to count products by category
    // For now, we'll proceed with soft delete

    await categoryService.deleteCategory(id);

    return NextResponse.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
