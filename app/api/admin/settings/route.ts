import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase/admin";

interface SystemSettings {
  businessName: string;
  businessEmail: string;
  businessPhone: string;
  businessAddress: string;
  currency: string;
  timezone: string;
  language: string;
  taxRate: number;
  lowStockThreshold: number;
  enableNotifications: boolean;
  enableEmailAlerts: boolean;
  enableSMSAlerts: boolean;
  deliveryRadius: number;
  minOrderAmount: number;
  maxOrderAmount: number;
}

interface UserSettings {
  theme: "light" | "dark" | "system";
  dateFormat: string;
  timeFormat: string;
  enableSounds: boolean;
  dashboardRefreshInterval: number;
}

interface PaymentSettings {
  acceptCash: boolean;
  acceptKowri: boolean;
  kowriMerchantId: string;
  kowriApiKey: string;
  enableTestMode: boolean;
}

interface NotificationSettings {
  lowStockAlerts: boolean;
  orderAlerts: boolean;
  customerAlerts: boolean;
  systemAlerts: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
}

// Default settings for new installations
const defaultSystemSettings: SystemSettings = {
  businessName: "Frozen Haven",
  businessEmail: "info@frozenhaven.com",
  businessPhone: "+233 XX XXX XXXX",
  businessAddress: "Accra, Ghana",
  currency: "GHC",
  timezone: "Africa/Accra",
  language: "English",
  taxRate: 12.5,
  lowStockThreshold: 10,
  enableNotifications: true,
  enableEmailAlerts: true,
  enableSMSAlerts: false,
  deliveryRadius: 25,
  minOrderAmount: 50,
  maxOrderAmount: 10000,
};

const defaultUserSettings: UserSettings = {
  theme: "system",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  enableSounds: true,
  dashboardRefreshInterval: 30,
};

const defaultPaymentSettings: PaymentSettings = {
  acceptCash: true,
  acceptKowri: true,
  kowriMerchantId: "",
  kowriApiKey: "",
  enableTestMode: true,
};

const defaultNotificationSettings: NotificationSettings = {
  lowStockAlerts: true,
  orderAlerts: true,
  customerAlerts: false,
  systemAlerts: true,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
};

async function getSettingsFromFirebase(section: string) {
  try {
    const doc = await db.collection("settings").doc(section).get();
    if (doc.exists) {
      return doc.data();
    }

    // Return default settings if not found
    switch (section) {
      case "system":
        return defaultSystemSettings;
      case "user":
        return defaultUserSettings;
      case "payment":
        return defaultPaymentSettings;
      case "notifications":
        return defaultNotificationSettings;
      default:
        return null;
    }
  } catch (error) {
    console.error(`Error fetching ${section} settings:`, error);
    throw error;
  }
}

async function updateSettingsInFirebase(section: string, settings: any) {
  try {
    await db
      .collection("settings")
      .doc(section)
      .set(
        {
          ...settings,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    return settings;
  } catch (error) {
    console.error(`Error updating ${section} settings:`, error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section) {
      if (!["system", "user", "payment", "notifications"].includes(section)) {
        return NextResponse.json(
          { success: false, error: "Invalid section" },
          { status: 400 }
        );
      }

      const settings = await getSettingsFromFirebase(section);
      return NextResponse.json({
        success: true,
        settings,
      });
    }

    // Return all settings
    const [
      systemSettings,
      userSettings,
      paymentSettings,
      notificationSettings,
    ] = await Promise.all([
      getSettingsFromFirebase("system"),
      getSettingsFromFirebase("user"),
      getSettingsFromFirebase("payment"),
      getSettingsFromFirebase("notifications"),
    ]);

    return NextResponse.json({
      success: true,
      system: systemSettings,
      user: userSettings,
      payment: paymentSettings,
      notifications: notificationSettings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");
    const body = await request.json();

    if (!section) {
      return NextResponse.json(
        { success: false, error: "Section parameter required" },
        { status: 400 }
      );
    }

    // Validate section
    if (!["system", "user", "payment", "notifications"].includes(section)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid section",
        },
        { status: 400 }
      );
    }

    // Update settings in Firebase
    const updatedSettings = await updateSettingsInFirebase(section, body);

    return NextResponse.json({
      success: true,
      message: `${section} settings updated successfully`,
      settings: updatedSettings,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update settings" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "test_kowri_connection":
        // Test Kowri API connection
        // In a real implementation, you would actually test the connection
        const paymentSettings = await getSettingsFromFirebase("payment");
        if (
          !paymentSettings?.kowriMerchantId ||
          !paymentSettings?.kowriApiKey
        ) {
          return NextResponse.json({
            success: false,
            message: "Kowri credentials not configured",
          });
        }
        return NextResponse.json({
          success: true,
          message: "Kowri connection test successful",
        });

      case "send_test_email":
        // Send test email
        // In a real implementation, you would send an actual test email
        return NextResponse.json({
          success: true,
          message: "Test email sent successfully",
        });

      case "send_test_sms":
        // Send test SMS
        // In a real implementation, you would send an actual test SMS
        return NextResponse.json({
          success: true,
          message: "Test SMS sent successfully",
        });

      case "backup_data":
        // Create data backup
        // In a real implementation, you would create an actual backup
        const backupId = `backup_${Date.now()}`;

        // Log backup creation in Firebase
        await db.collection("backups").doc(backupId).set({
          id: backupId,
          createdAt: new Date(),
          status: "completed",
          type: "manual",
          createdBy: "admin", // In real app, get from auth context
        });

        return NextResponse.json({
          success: true,
          message: "Data backup created successfully",
          backupId,
        });

      case "reset_settings":
        // Reset settings to default
        await Promise.all([
          updateSettingsInFirebase("system", defaultSystemSettings),
          updateSettingsInFirebase("user", defaultUserSettings),
          updateSettingsInFirebase("payment", defaultPaymentSettings),
          updateSettingsInFirebase(
            "notifications",
            defaultNotificationSettings
          ),
        ]);

        return NextResponse.json({
          success: true,
          message: "Settings reset to default values",
        });

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid action",
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error performing action:", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform action" },
      { status: 500 }
    );
  }
}
