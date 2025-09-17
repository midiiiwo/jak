import { NextRequest, NextResponse } from "next/server";

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

// Mock settings data
const mockSystemSettings: SystemSettings = {
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

const mockUserSettings: UserSettings = {
  theme: "system",
  dateFormat: "DD/MM/YYYY",
  timeFormat: "24h",
  enableSounds: true,
  dashboardRefreshInterval: 30,
};

const mockPaymentSettings: PaymentSettings = {
  acceptCash: true,
  acceptKowri: true,
  kowriMerchantId: "",
  kowriApiKey: "",
  enableTestMode: true,
};

const mockNotificationSettings: NotificationSettings = {
  lowStockAlerts: true,
  orderAlerts: true,
  customerAlerts: false,
  systemAlerts: true,
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section) {
      switch (section) {
        case "system":
          return NextResponse.json({ settings: mockSystemSettings });
        case "user":
          return NextResponse.json({ settings: mockUserSettings });
        case "payment":
          return NextResponse.json({ settings: mockPaymentSettings });
        case "notifications":
          return NextResponse.json({ settings: mockNotificationSettings });
        default:
          return NextResponse.json(
            { error: "Invalid section" },
            { status: 400 }
          );
      }
    }

    // Return all settings
    return NextResponse.json({
      system: mockSystemSettings,
      user: mockUserSettings,
      payment: mockPaymentSettings,
      notifications: mockNotificationSettings,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
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
        { error: "Section parameter required" },
        { status: 400 }
      );
    }

    // Validate section
    if (!["system", "user", "payment", "notifications"].includes(section)) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    // In a real application, you would update the settings in your database
    console.log(`Updating ${section} settings:`, body);

    // Return success response
    return NextResponse.json({
      message: `${section} settings updated successfully`,
      settings: body,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
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
        return NextResponse.json({
          success: true,
          message: "Kowri connection test successful",
        });

      case "send_test_email":
        // Send test email
        return NextResponse.json({
          success: true,
          message: "Test email sent successfully",
        });

      case "send_test_sms":
        // Send test SMS
        return NextResponse.json({
          success: true,
          message: "Test SMS sent successfully",
        });

      case "backup_data":
        // Create data backup
        return NextResponse.json({
          success: true,
          message: "Data backup created successfully",
          backupId: `backup_${Date.now()}`,
        });

      case "reset_settings":
        // Reset settings to default
        return NextResponse.json({
          success: true,
          message: "Settings reset to default values",
        });

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error performing action:", error);
    return NextResponse.json(
      { error: "Failed to perform action" },
      { status: 500 }
    );
  }
}
