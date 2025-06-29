// src/components/layouts/AppLayout.tsx
import React from "react";
import {
  SidebarLayout,
  Sidebar,
  type SidebarItem,
  type User,
} from "@/components/custom/sidebar"; // Your custom components

import { useAuth } from "@/store/auth";
import { useNavigate } from "react-router-dom";
import { sidebarItems } from "@/router";

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();

  const navigate = useNavigate();

  // Define sidebar items here (you can move this to a separate config file later)

  const sidebarUser: User = {
    name: user?.name || "User",
    email: user?.email || "",
    initials: user?.name
      ? user.name
          .split(" ")
          .map((n) => n[0])
          .join("")
      : "U",
  };

  const handleItemClick = (item: SidebarItem) => {
    if (item.onClick) {
      item.onClick();
    }
    if (item.href) {
      navigate(item.href);
    }
    console.log("Clicked item:", item);
    // Handle navigation here if needed
  };

  const handleUserMenuClick = (action: string) => {
    console.log("User menu action:", action);
    switch (action) {
      case "profile":
        // Navigate to profile
        break;
      case "settings":
        // Navigate to settings
        break;
      case "logout":
        logout();
        break;
    }
  };

  return (
    <SidebarLayout
      sidebar={
        <Sidebar
          items={sidebarItems}
          user={sidebarUser}
          onItemClick={handleItemClick}
          onUserMenuClick={handleUserMenuClick}
          title="CAYIBA"
          collapsible={true}
        />
      }
    >
      {children}
    </SidebarLayout>
  );
};
