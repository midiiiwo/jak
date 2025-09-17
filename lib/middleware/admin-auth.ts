import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/firebase/admin";
import { cookies } from "next/headers";

export interface AdminUser {
  uid: string;
  email: string;
  role: "superadmin" | "admin" | "manager" | "staff";
  permissions: string[];
}

export interface AuthenticatedRequest extends NextRequest {
  user?: AdminUser;
}

/**
 * Middleware to verify admin authentication and authorization
 */
export async function verifyAdminAuth(request: NextRequest): Promise<{
  success: boolean;
  user?: AdminUser;
  error?: string;
  response?: NextResponse;
}> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session")?.value;

    if (!sessionCookie) {
      return {
        success: false,
        error: "No session cookie found",
        response: NextResponse.json(
          { success: false, error: "Authentication required" },
          { status: 401 }
        ),
      };
    }

    // Verify the session cookie
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

    // Check if user is admin
    if (decodedClaims.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return {
        success: false,
        error: "User is not authorized as admin",
        response: NextResponse.json(
          { success: false, error: "Admin access required" },
          { status: 403 }
        ),
      };
    }

    // Get user role and permissions (for now, default to admin)
    // In a real app, this would come from the database
    const adminUser: AdminUser = {
      uid: decodedClaims.uid,
      email: decodedClaims.email!,
      role: "admin",
      permissions: [
        "products:read",
        "products:write",
        "products:delete",
        "orders:read",
        "orders:write",
        "orders:delete",
        "customers:read",
        "customers:write",
        "categories:read",
        "categories:write",
        "analytics:read",
        "settings:read",
        "settings:write",
      ],
    };

    return {
      success: true,
      user: adminUser,
    };
  } catch (error) {
    console.error("Admin auth verification failed:", error);
    return {
      success: false,
      error: "Authentication verification failed",
      response: NextResponse.json(
        { success: false, error: "Invalid session" },
        { status: 401 }
      ),
    };
  }
}

/**
 * Higher-order function to protect admin API routes
 */
export function withAdminAuth(
  handler: (
    request: NextRequest,
    context?: any,
    user?: AdminUser
  ) => Promise<NextResponse>,
  requiredPermissions?: string[]
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    const authResult = await verifyAdminAuth(request);

    if (!authResult.success) {
      return authResult.response!;
    }

    const user = authResult.user!;

    // Check permissions if required
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.every((permission) =>
        user.permissions.includes(permission)
      );

      if (!hasPermission) {
        return NextResponse.json(
          { success: false, error: "Insufficient permissions" },
          { status: 403 }
        );
      }
    }

    // Call the original handler with the authenticated user
    return handler(request, context, user);
  };
}

/**
 * Check if user has specific permission
 */
export function hasPermission(user: AdminUser, permission: string): boolean {
  return user.permissions.includes(permission);
}

/**
 * Check if user has role
 */
export function hasRole(user: AdminUser, role: AdminUser["role"]): boolean {
  return user.role === role;
}

/**
 * Check if user has minimum role level
 */
export function hasMinimumRole(
  user: AdminUser,
  minimumRole: AdminUser["role"]
): boolean {
  const roleHierarchy: { [key in AdminUser["role"]]: number } = {
    staff: 1,
    manager: 2,
    admin: 3,
    superadmin: 4,
  };

  return roleHierarchy[user.role] >= roleHierarchy[minimumRole];
}
