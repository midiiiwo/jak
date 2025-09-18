import { useState, useEffect } from "react";
import {
  User,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth as clientAuth } from "./firebase"; // Renamed to avoid conflict
import { useRouter } from "next/navigation";

interface AdminUser extends User {
  isAdmin?: boolean;
}

export function useAdminAuth() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();

  // ✅ Secure backend verification with session cookies
  const verifyAdminStatus = async (user: User): Promise<boolean> => {
    setIsVerifying(true);
    try {
      const idToken = await user.getIdToken();

      // Create session cookie for admin authentication
      const sessionResponse = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!sessionResponse.ok) {
        console.error("Session creation error:", sessionResponse.status);
        return false;
      }

      const sessionData = await sessionResponse.json();
      console.log("Backend session creation:", sessionData);

      if (sessionData.success) {
        // Store user data (session cookie is handled by browser)
        localStorage.setItem(
          "adminUser",
          JSON.stringify({
            uid: user.uid,
            email: user.email,
            isAdmin: true,
          })
        );
        return true;
      }

      return false;
    } catch (error) {
      console.error("Admin verification failed:", error);
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  // Check for existing session on app load
  useEffect(() => {
    const checkExistingSession = async () => {
      const userData = localStorage.getItem("adminUser");

      if (userData) {
        try {
          const parsedUser = JSON.parse(userData);
          setUser({ ...parsedUser, isAdmin: true } as AdminUser);
          setLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("adminUser");
        }
      }

      // If no valid session, proceed with Firebase auth state check
      const unsubscribe = onAuthStateChanged(
        clientAuth,
        async (currentUser) => {
          if (!currentUser) {
            setUser(null);
            setLoading(false);

            // Redirect to login if on admin page
            if (typeof window !== "undefined") {
              const pathname = window.location.pathname;
              if (
                pathname.startsWith("/admin") &&
                pathname !== "/admin/login"
              ) {
                router.push("/admin/login");
              }
            }
            return;
          }

          // ✅ Secure backend verification
          const isAdmin = await verifyAdminStatus(currentUser);

          console.log("Auth state - Is admin?", isAdmin);

          if (!isAdmin) {
            console.warn("Non-admin user attempted to access admin area");
            await signOut(clientAuth);
            setUser(null);
            setLoading(false);
            router.push("/admin/login");
            return;
          }

          // ✅ User is confirmed admin
          setUser({ ...currentUser, isAdmin: true });
          setLoading(false);

          // Redirect to /admin if on login page
          if (
            typeof window !== "undefined" &&
            window.location.pathname === "/admin/login"
          ) {
            router.push("/admin");
          }
        }
      );

      return () => unsubscribe();
    };

    checkExistingSession();
  }, [router]);

  const adminSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      const result = await signInWithEmailAndPassword(
        clientAuth,
        email,
        password
      );

      // ✅ Secure backend verification
      const isAdmin = await verifyAdminStatus(result.user);

      if (!isAdmin) {
        await signOut(clientAuth);
        throw new Error("Unauthorized access - not an admin");
      }

      console.log("Admin login successful");

      // Redirect after successful login
      if (
        typeof window !== "undefined" &&
        window.location.pathname === "/admin/login"
      ) {
        router.push("/admin");
      }

      return result.user;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during sign in"
      );
      setLoading(false);
      throw err;
    }
  };

  const adminLogout = async () => {
    try {
      setError(null);
      await signOut(clientAuth);

      // Remove stored user data
      localStorage.removeItem("adminUser");

      // Call logout endpoint to clear session cookie
      await fetch("/api/auth/session-logout", { method: "POST" });

      router.push("/admin/login");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An error occurred during logout"
      );
      throw err;
    }
  };

  return {
    user,
    loading: loading || isVerifying,
    error,
    adminSignIn,
    adminLogout,
    isAdmin: user?.isAdmin || false,
  };
}
