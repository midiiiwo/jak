import { NextRequest, NextResponse } from "next/server";
import { categoryService } from "@/lib/services/database-service";

// GET - Fetch all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get("active") !== "false";

    const categories = await categoryService.getCategories(activeOnly);

    return NextResponse.json({
      success: true,
      categories: categories.sort((a, b) => a.name.localeCompare(b.name)),
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, isActive = true, sortOrder = 0, image } = body;

    if (!name || !description) {
      return NextResponse.json(
        { success: false, error: "Name and description are required" },
        { status: 400 }
      );
    }

    // Check if category with same name exists
    const existingCategories = await categoryService.getCategories(false);
    const existingCategory = existingCategories.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase()
    );

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category with this name already exists" },
        { status: 400 }
      );
    }

    const newCategoryData = {
      name: name.trim(),
      description: description.trim(),
      image: image || "",
      isActive,
      sortOrder,
    };

    const newCategory = await categoryService.createCategory(newCategoryData);

    return NextResponse.json({
      success: true,
      category: newCategory,
      message: "Category created successfully",
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create category" },
      { status: 500 }
    );
  }
}
