"use client";

import { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Card,
  Badge,
  Button,
  Heading,
  Grid,
  Alert,
  Spinner,
  Select,
  Field,
  Input,
  IconButton,
  Circle,
} from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import {
  FaBell,
  FaEnvelope,
  FaSms,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaRefresh,
  FaSearch,
} from "react-icons/fa";

interface AdminAlert {
  id: string;
  message: string;
  category: "order" | "inventory" | "customer" | "system" | "payment";
  priority: "low" | "medium" | "high";
  isRead: boolean;
  createdAt: any;
  expiresAt: any;
  metadata?: Record<string, any>;
}

interface NotificationLog {
  id: string;
  type: "email" | "sms" | "push" | "admin_alert";
  recipient: string;
  subject?: string;
  message: string;
  status: "sent" | "failed" | "pending";
  sentAt?: any;
  createdAt: any;
  error?: string;
}

export default function NotificationsDashboard() {
  const [alerts, setAlerts] = useState<AdminAlert[]>([]);
  const [notifications, setNotifications] = useState<NotificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [alertsLoading, setAlertsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"alerts" | "logs">("alerts");
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  // Fetch alerts and notifications
  const fetchAlerts = async () => {
    setAlertsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/alerts?unreadOnly=${showUnreadOnly}&limit=50`
      );
      const data = await response.json();
      if (data.success) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
    setAlertsLoading(false);
  };

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/admin/notifications?limit=50");
      const data = await response.json();
      if (data.success) {
        setNotifications(data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchNotifications();
    setLoading(false);

    // Set up polling for real-time updates
    const interval = setInterval(() => {
      fetchAlerts();
      fetchNotifications();
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [showUnreadOnly]);

  // Mark alert as read
  const markAsRead = async (alertId: string) => {
    try {
      const response = await fetch("/api/admin/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "markAsRead", alertId }),
      });

      if (response.ok) {
        setAlerts((prev) =>
          prev.map((alert) =>
            alert.id === alertId ? { ...alert, isRead: true } : alert
          )
        );
      }
    } catch (error) {
      console.error("Error marking alert as read:", error);
    }
  };

  // Cleanup expired alerts
  const cleanupAlerts = async () => {
    try {
      await fetch("/api/admin/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "cleanup" }),
      });
      fetchAlerts();
    } catch (error) {
      console.error("Error cleaning up alerts:", error);
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "red";
      case "medium":
        return "orange";
      case "low":
        return "green";
      default:
        return "gray";
    }
  };

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "order":
        return "📦";
      case "inventory":
        return "📊";
      case "customer":
        return "👤";
      case "system":
        return "⚙️";
      case "payment":
        return "💳";
      default:
        return "🔔";
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent":
        return "green";
      case "failed":
        return "red";
      case "pending":
        return "orange";
      default:
        return "gray";
    }
  };

  // Filter alerts
  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch = alert.message
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || alert.category === filterCategory;
    const matchesPriority =
      filterPriority === "all" || alert.priority === filterPriority;
    return matchesSearch && matchesCategory && matchesPriority;
  });

  // Filter notifications
  const filteredNotifications = notifications.filter((notif) => {
    const matchesSearch =
      notif.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notif.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const unreadCount = alerts.filter((alert) => !alert.isRead).length;

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading notifications...</Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <VStack gap={6} align="stretch">
        {/* Header */}
        <HStack justify="space-between" align="center">
          <VStack align="start" gap={0}>
            <Heading size="lg" color={textColor}>
              🔔 Notifications & Alerts
            </Heading>
            <Text color={mutedTextColor}>
              Manage system alerts and notification logs
            </Text>
          </VStack>

          <HStack>
            <Button
              onClick={() => {
                fetchAlerts();
                fetchNotifications();
              }}
              size="sm"
              variant="outline"
              leftIcon={<FaRefresh />}
              loading={alertsLoading}
            >
              Refresh
            </Button>
            <Button
              onClick={cleanupAlerts}
              size="sm"
              colorScheme="red"
              variant="outline"
              leftIcon={<FaTrash />}
            >
              Cleanup
            </Button>
          </HStack>
        </HStack>

        {/* Stats Cards */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
          <Card.Root bg={cardBg} border="1px solid" borderColor={borderColor}>
            <Card.Body p={4}>
              <HStack justify="space-between">
                <VStack align="start" gap={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="red.500">
                    {unreadCount}
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Unread Alerts
                  </Text>
                </VStack>
                <Circle size="40px" bg="red.100" color="red.500">
                  <FaBell />
                </Circle>
              </HStack>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} border="1px solid" borderColor={borderColor}>
            <Card.Body p={4}>
              <HStack justify="space-between">
                <VStack align="start" gap={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="blue.500">
                    {alerts.length}
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Total Alerts
                  </Text>
                </VStack>
                <Circle size="40px" bg="blue.100" color="blue.500">
                  <FaEye />
                </Circle>
              </HStack>
            </Card.Body>
          </Card.Root>

          <Card.Root bg={cardBg} border="1px solid" borderColor={borderColor}>
            <Card.Body p={4}>
              <HStack justify="space-between">
                <VStack align="start" gap={0}>
                  <Text fontSize="2xl" fontWeight="bold" color="green.500">
                    {notifications.filter((n) => n.status === "sent").length}
                  </Text>
                  <Text fontSize="sm" color={mutedTextColor}>
                    Sent Notifications
                  </Text>
                </VStack>
                <Circle size="40px" bg="green.100" color="green.500">
                  <FaEnvelope />
                </Circle>
              </HStack>
            </Card.Body>
          </Card.Root>
        </Grid>

        {/* Tabs */}
        <HStack gap={2}>
          <Button
            variant={activeTab === "alerts" ? "solid" : "outline"}
            onClick={() => setActiveTab("alerts")}
            size="sm"
          >
            Alerts ({alerts.length})
          </Button>
          <Button
            variant={activeTab === "logs" ? "solid" : "outline"}
            onClick={() => setActiveTab("logs")}
            size="sm"
          >
            Notification Logs ({notifications.length})
          </Button>
        </HStack>

        {/* Filters */}
        <Card.Root bg={cardBg} border="1px solid" borderColor={borderColor}>
          <Card.Body p={4}>
            <Grid
              templateColumns={{ base: "1fr", md: "repeat(4, 1fr)" }}
              gap={4}
            >
              <Field.Root>
                <Field.Label>Search</Field.Label>
                <Input
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Field.Root>

              {activeTab === "alerts" && (
                <>
                  <Field.Root>
                    <Field.Label>Category</Field.Label>
                    <Select.Root
                      value={filterCategory}
                      onValueChange={(e) => setFilterCategory(e.value)}
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="All Categories" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="all">All Categories</Select.Item>
                        <Select.Item value="order">Order</Select.Item>
                        <Select.Item value="inventory">Inventory</Select.Item>
                        <Select.Item value="customer">Customer</Select.Item>
                        <Select.Item value="system">System</Select.Item>
                        <Select.Item value="payment">Payment</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Field.Root>

                  <Field.Root>
                    <Field.Label>Priority</Field.Label>
                    <Select.Root
                      value={filterPriority}
                      onValueChange={(e) => setFilterPriority(e.value)}
                    >
                      <Select.Trigger>
                        <Select.ValueText placeholder="All Priorities" />
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Item value="all">All Priorities</Select.Item>
                        <Select.Item value="high">High</Select.Item>
                        <Select.Item value="medium">Medium</Select.Item>
                        <Select.Item value="low">Low</Select.Item>
                      </Select.Content>
                    </Select.Root>
                  </Field.Root>

                  <VStack align="start" justify="end">
                    <Button
                      size="sm"
                      variant={showUnreadOnly ? "solid" : "outline"}
                      onClick={() => setShowUnreadOnly(!showUnreadOnly)}
                      leftIcon={showUnreadOnly ? <FaEyeSlash /> : <FaEye />}
                    >
                      {showUnreadOnly ? "Show All" : "Unread Only"}
                    </Button>
                  </VStack>
                </>
              )}
            </Grid>
          </Card.Body>
        </Card.Root>

        {/* Content */}
        {activeTab === "alerts" ? (
          <VStack gap={3} align="stretch">
            {alertsLoading ? (
              <Box textAlign="center" py={8}>
                <Spinner />
                <Text mt={2}>Loading alerts...</Text>
              </Box>
            ) : filteredAlerts.length === 0 ? (
              <Alert.Root status="info">
                <Alert.Indicator />
                <Alert.Description>
                  No alerts found matching your criteria.
                </Alert.Description>
              </Alert.Root>
            ) : (
              filteredAlerts.map((alert) => (
                <Card.Root
                  key={alert.id}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={
                    alert.isRead
                      ? borderColor
                      : getPriorityColor(alert.priority) + ".200"
                  }
                  cursor="pointer"
                  _hover={{ bg: hoverBg }}
                  onClick={() => !alert.isRead && markAsRead(alert.id)}
                >
                  <Card.Body p={4}>
                    <HStack justify="space-between" align="start">
                      <HStack align="start" gap={3} flex={1}>
                        <Text fontSize="2xl">
                          {getCategoryIcon(alert.category)}
                        </Text>
                        <VStack align="start" gap={1} flex={1}>
                          <HStack gap={2}>
                            <Badge
                              colorScheme={getPriorityColor(alert.priority)}
                            >
                              {alert.priority.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">{alert.category}</Badge>
                            {!alert.isRead && (
                              <Badge colorScheme="blue">NEW</Badge>
                            )}
                          </HStack>
                          <Text fontWeight={alert.isRead ? "normal" : "bold"}>
                            {alert.message}
                          </Text>
                          <Text fontSize="sm" color={mutedTextColor}>
                            {new Date(
                              alert.createdAt?.toDate?.() || alert.createdAt
                            ).toLocaleString()}
                          </Text>
                        </VStack>
                      </HStack>
                      {!alert.isRead && (
                        <IconButton
                          size="sm"
                          variant="ghost"
                          icon={<FaEye />}
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(alert.id);
                          }}
                        />
                      )}
                    </HStack>
                  </Card.Body>
                </Card.Root>
              ))
            )}
          </VStack>
        ) : (
          <VStack gap={3} align="stretch">
            {filteredNotifications.length === 0 ? (
              <Alert.Root status="info">
                <Alert.Indicator />
                <Alert.Description>
                  No notification logs found.
                </Alert.Description>
              </Alert.Root>
            ) : (
              filteredNotifications.map((notif) => (
                <Card.Root
                  key={notif.id}
                  bg={cardBg}
                  border="1px solid"
                  borderColor={borderColor}
                >
                  <Card.Body p={4}>
                    <HStack justify="space-between" align="start">
                      <HStack align="start" gap={3} flex={1}>
                        <Circle
                          size="40px"
                          bg={getStatusColor(notif.status) + ".100"}
                          color={getStatusColor(notif.status) + ".500"}
                        >
                          {notif.type === "email" ? (
                            <FaEnvelope />
                          ) : notif.type === "sms" ? (
                            <FaSms />
                          ) : (
                            <FaBell />
                          )}
                        </Circle>
                        <VStack align="start" gap={1} flex={1}>
                          <HStack gap={2}>
                            <Badge colorScheme={getStatusColor(notif.status)}>
                              {notif.status.toUpperCase()}
                            </Badge>
                            <Badge variant="outline">
                              {notif.type.toUpperCase()}
                            </Badge>
                          </HStack>
                          <Text fontWeight="medium">To: {notif.recipient}</Text>
                          {notif.subject && (
                            <Text fontSize="sm" fontWeight="medium">
                              Subject: {notif.subject}
                            </Text>
                          )}
                          <Text fontSize="sm">{notif.message}</Text>
                          <HStack gap={4}>
                            <Text fontSize="xs" color={mutedTextColor}>
                              Created:{" "}
                              {new Date(
                                notif.createdAt?.toDate?.() || notif.createdAt
                              ).toLocaleString()}
                            </Text>
                            {notif.sentAt && (
                              <Text fontSize="xs" color={mutedTextColor}>
                                Sent:{" "}
                                {new Date(
                                  notif.sentAt?.toDate?.() || notif.sentAt
                                ).toLocaleString()}
                              </Text>
                            )}
                          </HStack>
                          {notif.error && (
                            <Text fontSize="sm" color="red.500">
                              Error: {notif.error}
                            </Text>
                          )}
                        </VStack>
                      </HStack>
                    </HStack>
                  </Card.Body>
                </Card.Root>
              ))
            )}
          </VStack>
        )}
      </VStack>
    </Box>
  );
}
