"use client";
import {
  VStack,
  HStack,
  Circle,
  IconButton,
  Separator,
  Text,
  Button,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  FaLeaf,
  FaTimes,
  FaBars,
  FaStore,
  FaTachometerAlt,
  FaChartBar,
  FaBoxes,
  FaShoppingCart,
  FaUsers,
  FaCog,
  FaBell,
  FaTags,
  FaWarehouse,
} from "react-icons/fa";
import { ColorModeButton } from "@/components/ui/color-mode";
import { NavLink } from "./nav-link";
import { UserSection } from "./user-section";

interface SidebarProps {
  isCollapsed: boolean;
  isMobileMenuOpen: boolean;
  pathname: string;
  bgColor: string;
  textColor: string;
  mutedTextColor: string;
  hoverBg: string;
  activeBg: string;
  activeColor: string;
  handleLogout: () => void;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}

export function Sidebar({
  isCollapsed,
  isMobileMenuOpen,
  pathname,
  bgColor,
  textColor,
  mutedTextColor,
  hoverBg,
  activeBg,
  activeColor,
  handleLogout,
  onToggleCollapse,
  onCloseMobile,
}: SidebarProps) {
  return (
    <VStack
      align={isCollapsed ? "center" : "start"}
      gap={6}
      position="relative"
    >
      {/* Mobile Close Button */}
      <IconButton
        aria-label="Close menu"
        position="absolute"
        right={0}
        top={0}
        size="sm"
        variant="ghost"
        display={{ base: "flex", md: "none" }}
        onClick={onCloseMobile}
      >
        <FaTimes />
      </IconButton>

      {/* Logo & Toggle */}
      {!isCollapsed ? (
        <HStack justify="space-between" w="100%" mt={{ base: 8, md: 0 }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <HStack cursor="pointer">
              <Circle
                size={{ base: "36px", md: "40px" }}
                bg="green.700"
                color="white"
              >
                <FaLeaf />
              </Circle>
              <VStack align="start" gap={0}>
                <Text
                  fontSize={{ base: "md", md: "lg" }}
                  fontWeight="bold"
                  color="green.700"
                >
                  Frozen Haven
                </Text>
              </VStack>
            </HStack>
          </Link>
          <IconButton
            aria-label="Collapse sidebar"
            size="sm"
            variant="ghost"
            display={{ base: "none", md: "flex" }}
            onClick={onToggleCollapse}
          >
            <FaTimes />
          </IconButton>
        </HStack>
      ) : (
        <VStack gap={3} w="100%">
          <Link href="/" style={{ textDecoration: "none" }}>
            <Circle size="40px" bg="green.700" color="white" cursor="pointer">
              <FaLeaf />
            </Circle>
          </Link>
          <IconButton
            aria-label="Expand sidebar"
            size="sm"
            variant="ghost"
            onClick={onToggleCollapse}
          >
            <FaBars />
          </IconButton>
        </VStack>
      )}

      {!isCollapsed && <ColorModeButton size="sm" alignSelf="flex-end" />}

      <Separator />

      {/* Navigation Sections */}
      <VStack align={isCollapsed ? "center" : "start"} gap={2} w="100%">
        {!isCollapsed && (
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={mutedTextColor}
            textTransform="uppercase"
          >
            Dashboard
          </Text>
        )}
        <NavLink
          href="/admin"
          icon={<FaTachometerAlt />}
          isActive={pathname === "/admin" || pathname.startsWith("/admin/")}
          isCollapsed={isCollapsed}
          hoverBg={hoverBg}
          activeBg={activeBg}
          activeColor={activeColor}
          mutedTextColor={mutedTextColor}
        >
          Overview
        </NavLink>
        <NavLink
          href="/admin/analytics"
          icon={<FaChartBar />}
          isActive={pathname === "/admin/analytics"}
          isCollapsed={isCollapsed}
          hoverBg={hoverBg}
          activeBg={activeBg}
          activeColor={activeColor}
          mutedTextColor={mutedTextColor}
        >
          Analytics
        </NavLink>
      </VStack>

      <VStack align={isCollapsed ? "center" : "start"} gap={2} w="100%">
        {!isCollapsed && (
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={mutedTextColor}
            textTransform="uppercase"
          >
            Management
          </Text>
        )}
        <NavLink
          href="/admin/products"
          icon={<FaBoxes />}
          isActive={
            pathname === "/admin/products" ||
            pathname.startsWith("/admin/products")
          }
          isCollapsed={isCollapsed}
          hoverBg={hoverBg}
          activeBg={activeBg}
          activeColor={activeColor}
          mutedTextColor={mutedTextColor}
        >
          Products
        </NavLink>
        <NavLink
          href="/admin/categories"
          icon={<FaTags />}
          isActive={pathname === "/admin/categories"}
          isCollapsed={isCollapsed}
          hoverBg={hoverBg}
          activeBg={activeBg}
          activeColor={activeColor}
          mutedTextColor={mutedTextColor}
        >
          Categories
        </NavLink>
        <NavLink
          href="/admin/orders"
          icon={<FaShoppingCart />}
          isActive={
            pathname === "/admin/orders" || pathname.startsWith("/admin/orders")
          }
          isCollapsed={isCollapsed}
          hoverBg={hoverBg}
          activeBg={activeBg}
          activeColor={activeColor}
          mutedTextColor={mutedTextColor}
        >
          Orders
        </NavLink>
        <NavLink
          href="/admin/stock"
          icon={<FaWarehouse />}
          isActive={
            pathname === "/admin/stock" || pathname.startsWith("/admin/stock")
          }
          isCollapsed={isCollapsed}
          hoverBg={hoverBg}
          activeBg={activeBg}
          activeColor={activeColor}
          mutedTextColor={mutedTextColor}
        >
          Stock
        </NavLink>
        <NavLink
          href="/admin/customers"
          icon={<FaUsers />}
          isActive={
            pathname === "/admin/customers" ||
            pathname.startsWith("/admin/customers")
          }
          isCollapsed={isCollapsed}
          hoverBg={hoverBg}
          activeBg={activeBg}
          activeColor={activeColor}
          mutedTextColor={mutedTextColor}
        >
          Customers
        </NavLink>
      </VStack>

      <VStack align={isCollapsed ? "center" : "start"} gap={2} w="100%">
        {!isCollapsed && (
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={mutedTextColor}
            textTransform="uppercase"
          >
            System
          </Text>
        )}
        <NavLink
          href="/admin/notifications"
          icon={<FaBell />}
          isActive={pathname === "/admin/notifications"}
          isCollapsed={isCollapsed}
          hoverBg={hoverBg}
          activeBg={activeBg}
          activeColor={activeColor}
          mutedTextColor={mutedTextColor}
        >
          Notifications
        </NavLink>
        <NavLink
          href="/admin/settings"
          icon={<FaCog />}
          isActive={pathname === "/admin/settings"}
          isCollapsed={isCollapsed}
          hoverBg={hoverBg}
          activeBg={activeBg}
          activeColor={activeColor}
          mutedTextColor={mutedTextColor}
        >
          Settings
        </NavLink>
      </VStack>

      {/* Quick Actions */}
      {!isCollapsed && (
        <VStack align="start" gap={2} w="100%">
          <Text
            fontSize="xs"
            fontWeight="bold"
            color={mutedTextColor}
            textTransform="uppercase"
          >
            Quick Actions
          </Text>
          <Link href="/admin/products/new" style={{ width: "100%" }}>
            <Button
              size="sm"
              bg="green.600"
              color="white"
              w="100%"
              _hover={{ bg: "green.700" }}
            >
              Add Product
            </Button>
          </Link>
          <Link href="/" style={{ width: "100%" }}>
            <Button size="sm" variant="outline" w="100%">
              <FaStore style={{ marginRight: "8px" }} />
              View Store
            </Button>
          </Link>
        </VStack>
      )}

      <UserSection
        isCollapsed={isCollapsed}
        textColor={textColor}
        mutedTextColor={mutedTextColor}
        handleLogout={handleLogout}
      />
    </VStack>
  );
}
