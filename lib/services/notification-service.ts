import { db } from "@/lib/firebase/admin";

export interface NotificationConfig {
  type: "email" | "sms" | "push" | "admin_alert";
  recipients: string[];
  subject?: string;
  message: string;
  priority: "low" | "medium" | "high";
  category: "order" | "inventory" | "customer" | "system" | "payment";
  metadata?: Record<string, any>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  htmlContent: string;
  textContent: string;
  variables: string[];
}

export interface NotificationLog {
  id: string;
  type: string;
  recipient: string;
  subject?: string;
  message: string;
  status: "sent" | "failed" | "pending";
  sentAt?: Date;
  error?: string;
  metadata?: Record<string, any>;
}

export class NotificationService {
  private collection = "notifications";
  private templatesCollection = "notification_templates";
  private logsCollection = "notification_logs";

  /**
   * Send notification based on type
   */
  async sendNotification(config: NotificationConfig): Promise<boolean> {
    try {
      // Log the notification attempt
      const logEntry: Partial<NotificationLog> = {
        type: config.type,
        recipient: config.recipients.join(", "),
        subject: config.subject,
        message: config.message,
        status: "pending",
        metadata: config.metadata,
      };

      const logRef = await db.collection(this.logsCollection).add({
        ...logEntry,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      let success = false;

      switch (config.type) {
        case "email":
          success = await this.sendEmail(config);
          break;
        case "sms":
          success = await this.sendSMS(config);
          break;
        case "push":
          success = await this.sendPushNotification(config);
          break;
        case "admin_alert":
          success = await this.sendAdminAlert(config);
          break;
        default:
          throw new Error(`Unsupported notification type: ${config.type}`);
      }

      // Update log with result
      await logRef.update({
        status: success ? "sent" : "failed",
        sentAt: success ? new Date() : null,
        updatedAt: new Date(),
      });

      return success;
    } catch (error) {
      console.error("Notification sending failed:", error);
      return false;
    }
  }

  /**
   * Send email notification
   */
  private async sendEmail(config: NotificationConfig): Promise<boolean> {
    try {
      // In a real implementation, integrate with email service like:
      // - SendGrid
      // - Mailgun
      // - AWS SES
      // - NodeMailer with SMTP

      // For now, simulate email sending
      console.log("📧 Email notification sent:", {
        to: config.recipients,
        subject: config.subject,
        message: config.message,
      });

      // TODO: Replace with actual email service integration
      // Example with SendGrid:
      /*
      const sgMail = require('@sendgrid/mail');
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);

      const msg = {
        to: config.recipients,
        from: 'noreply@frozenhaven.com',
        subject: config.subject,
        text: config.message,
        html: config.message,
      };

      await sgMail.send(msg);
      */

      return true;
    } catch (error) {
      console.error("Email sending failed:", error);
      return false;
    }
  }

  /**
   * Send SMS notification
   */
  private async sendSMS(config: NotificationConfig): Promise<boolean> {
    try {
      // In a real implementation, integrate with SMS service like:
      // - Twilio
      // - AWS SNS
      // - Africa's Talking
      // - Hubtel SMS

      // For now, simulate SMS sending
      console.log("📱 SMS notification sent:", {
        to: config.recipients,
        message: config.message,
      });

      // TODO: Replace with actual SMS service integration
      // Example with Twilio:
      /*
      const twilio = require('twilio');
      const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

      for (const recipient of config.recipients) {
        await client.messages.create({
          body: config.message,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: recipient
        });
      }
      */

      return true;
    } catch (error) {
      console.error("SMS sending failed:", error);
      return false;
    }
  }

  /**
   * Send push notification
   */
  private async sendPushNotification(
    config: NotificationConfig
  ): Promise<boolean> {
    try {
      // In a real implementation, integrate with push service like:
      // - Firebase Cloud Messaging (FCM)
      // - OneSignal
      // - Pusher

      console.log("🔔 Push notification sent:", {
        to: config.recipients,
        title: config.subject,
        body: config.message,
      });

      // TODO: Replace with actual push service integration

      return true;
    } catch (error) {
      console.error("Push notification sending failed:", error);
      return false;
    }
  }

  /**
   * Send admin alert (real-time dashboard notification)
   */
  private async sendAdminAlert(config: NotificationConfig): Promise<boolean> {
    try {
      // Store alert in Firestore for real-time dashboard updates
      await db.collection("admin_alerts").add({
        message: config.message,
        category: config.category,
        priority: config.priority,
        metadata: config.metadata,
        isRead: false,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      });

      console.log("🚨 Admin alert created:", {
        message: config.message,
        category: config.category,
        priority: config.priority,
      });

      return true;
    } catch (error) {
      console.error("Admin alert creation failed:", error);
      return false;
    }
  }

  /**
   * Send low stock alert
   */
  async sendLowStockAlert(
    productTitle: string,
    currentStock: number,
    minLevel: number
  ): Promise<void> {
    await this.sendNotification({
      type: "admin_alert",
      recipients: ["admin"],
      subject: "Low Stock Alert",
      message: `${productTitle} is running low. Current stock: ${currentStock}, Minimum level: ${minLevel}`,
      priority: "high",
      category: "inventory",
      metadata: {
        productTitle,
        currentStock,
        minLevel,
      },
    });
  }

  /**
   * Send new order notification
   */
  async sendNewOrderNotification(
    orderId: string,
    customerName: string,
    total: number
  ): Promise<void> {
    await this.sendNotification({
      type: "admin_alert",
      recipients: ["admin"],
      subject: "New Order Received",
      message: `New order #${orderId} from ${customerName}. Total: GHC ${total}`,
      priority: "medium",
      category: "order",
      metadata: {
        orderId,
        customerName,
        total,
      },
    });
  }

  /**
   * Send order confirmation email to customer
   */
  async sendOrderConfirmationEmail(
    customerEmail: string,
    orderId: string,
    orderDetails: any
  ): Promise<void> {
    const emailContent = this.generateOrderConfirmationEmail(
      orderId,
      orderDetails
    );

    await this.sendNotification({
      type: "email",
      recipients: [customerEmail],
      subject: `Order Confirmation - #${orderId}`,
      message: emailContent,
      priority: "high",
      category: "order",
      metadata: {
        orderId,
        customerEmail,
      },
    });
  }

  /**
   * Send payment confirmation notification
   */
  async sendPaymentConfirmation(
    customerEmail: string,
    orderId: string,
    amount: number,
    transactionId: string
  ): Promise<void> {
    const message = `Payment confirmed for order #${orderId}. Amount: GHC ${amount}. Transaction ID: ${transactionId}`;

    await this.sendNotification({
      type: "email",
      recipients: [customerEmail],
      subject: `Payment Confirmed - Order #${orderId}`,
      message,
      priority: "high",
      category: "payment",
      metadata: {
        orderId,
        amount,
        transactionId,
      },
    });
  }

  /**
   * Generate order confirmation email template
   */
  private generateOrderConfirmationEmail(
    orderId: string,
    orderDetails: any
  ): string {
    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #2F855A; color: white; padding: 20px; text-align: center;">
        <h1>🧊 Frozen Haven</h1>
        <h2>Order Confirmation</h2>
      </div>

      <div style="padding: 20px;">
        <p>Dear ${orderDetails.customerName},</p>

        <p>Thank you for your order! We've received your order and are preparing it for delivery.</p>

        <div style="background-color: #f7fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> #${orderId}</p>
          <p><strong>Order Date:</strong> ${new Date().toLocaleDateString()}</p>
          <p><strong>Total Amount:</strong> GHC ${orderDetails.total}</p>
        </div>

        <div style="margin: 20px 0;">
          <h3>Items Ordered:</h3>
          ${orderDetails.items
            ?.map(
              (item: any) => `
            <div style="border-bottom: 1px solid #e2e8f0; padding: 10px 0;">
              <strong>${item.title}</strong> - Quantity: ${item.quantity} - GHC ${item.price}
            </div>
          `
            )
            .join("")}
        </div>

        <div style="background-color: #f0fff4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h3>Delivery Information</h3>
          <p><strong>Address:</strong> ${orderDetails.deliveryAddress}</p>
          <p><strong>Phone:</strong> ${orderDetails.customerPhone}</p>
        </div>

        <p>We'll send you another email when your order is ready for delivery.</p>

        <p>If you have any questions, feel free to contact us.</p>

        <p>Best regards,<br>The Frozen Haven Team</p>
      </div>

      <div style="background-color: #2F855A; color: white; padding: 20px; text-align: center;">
        <p>📞 (+233) 123-456-789 | 📧 info@frozenhaven.com</p>
        <p>Off Fiapre Odumase Road near Kyenky3 hene's House</p>
      </div>
    </div>
    `;
  }

  /**
   * Get notification logs with pagination
   */
  async getNotificationLogs(
    limit: number = 50,
    offset: number = 0
  ): Promise<NotificationLog[]> {
    try {
      const snapshot = await db
        .collection(this.logsCollection)
        .orderBy("createdAt", "desc")
        .limit(limit)
        .offset(offset)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as NotificationLog[];
    } catch (error) {
      console.error("Error fetching notification logs:", error);
      return [];
    }
  }

  /**
   * Get admin alerts
   */
  async getAdminAlerts(limit: number = 20): Promise<any[]> {
    try {
      const snapshot = await db
        .collection("admin_alerts")
        .where("expiresAt", ">", new Date())
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    } catch (error) {
      console.error("Error fetching admin alerts:", error);
      return [];
    }
  }

  /**
   * Mark admin alert as read
   */
  async markAlertAsRead(alertId: string): Promise<boolean> {
    try {
      await db.collection("admin_alerts").doc(alertId).update({
        isRead: true,
        readAt: new Date(),
      });
      return true;
    } catch (error) {
      console.error("Error marking alert as read:", error);
      return false;
    }
  }

  /**
   * Clean up expired alerts
   */
  async cleanupExpiredAlerts(): Promise<void> {
    try {
      const expiredQuery = await db
        .collection("admin_alerts")
        .where("expiresAt", "<", new Date())
        .get();

      const batch = db.batch();
      expiredQuery.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log(`Cleaned up ${expiredQuery.docs.length} expired alerts`);
    } catch (error) {
      console.error("Error cleaning up expired alerts:", error);
    }
  }
}

export const notificationService = new NotificationService();
