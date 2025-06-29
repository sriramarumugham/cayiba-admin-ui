import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  ChevronDown,
  ChevronRight,
  X,
  Settings,
  LogOut,
  User,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// Types and Interfaces
export interface SidebarItem {
  id: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: string | number;
  children?: SidebarItem[];
  onClick?: () => void;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
  initials?: string;
}

export interface SidebarContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeItem: string;
  setActiveItem: (item: string) => void;
  expandedItems: Set<string>;
  toggleExpanded: (item: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

interface SidebarProps {
  items: SidebarItem[];
  user?: User;
  onUserMenuClick?: (action: string) => void;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  defaultCollapsed?: boolean;
  title?: string;
}

interface SidebarLayoutProps {
  sidebar: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

// Sidebar Context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};

// Sidebar Provider - Enhanced with collapse functionality
const SidebarProvider: React.FC<{
  children: ReactNode;
  defaultOpen?: boolean;
  defaultCollapsed?: boolean;
}> = ({ children, defaultOpen = true, defaultCollapsed = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [activeItem, setActiveItem] = useState("dashboard");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const toggleExpanded = (item: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(item)) {
      newExpanded.delete(item);
    } else {
      newExpanded.add(item);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        activeItem,
        setActiveItem,
        expandedItems,
        toggleExpanded,
        isCollapsed,
        setIsCollapsed,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

// Sidebar Item Component - Enhanced with collapse support
const SidebarItemComponent: React.FC<{
  item: SidebarItem;
  level?: number;
  onItemClick?: (item: SidebarItem) => void;
}> = ({ item, level = 0, onItemClick }) => {
  const {
    activeItem,
    setActiveItem,
    expandedItems,
    toggleExpanded,
    isCollapsed,
  } = useSidebar();
  const hasChildren = item.children && item.children.length > 0;
  const isExpanded = expandedItems.has(item.id);
  const isActive = activeItem === item.id;

  const handleClick = () => {
    if (hasChildren && !isCollapsed) {
      toggleExpanded(item.id);
    } else {
      setActiveItem(item.id);
      if (item.onClick) {
        item.onClick();
      }
      if (onItemClick) {
        onItemClick(item);
      }
    }
  };

  return (
    <div>
      <Button
        variant={isActive ? "secondary" : "ghost"}
        className={cn(
          "w-full justify-start gap-2 px-2 py-2 h-9",
          level > 0 && !isCollapsed && "ml-4 w-[calc(100%-1rem)]",
          isCollapsed && "justify-center px-2",
        )}
        onClick={handleClick}
        title={isCollapsed ? item.label : undefined}
      >
        {item.icon && <item.icon className="h-4 w-4 shrink-0" />}
        {!isCollapsed && (
          <>
            <span className="truncate">{item.label}</span>
            {item.badge && (
              <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              <div className="ml-auto">
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </div>
            )}
          </>
        )}
      </Button>

      {hasChildren && isExpanded && !isCollapsed && (
        <div className="mt-1 space-y-1">
          {item.children!.map((child) => (
            <SidebarItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// User Menu Component - Enhanced with collapse support
const UserMenu: React.FC<{
  user: User;
  onMenuClick?: (action: string) => void;
}> = ({ user, onMenuClick }) => {
  const { isCollapsed } = useSidebar();

  if (isCollapsed) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="w-full justify-center p-2"
            title={user.name}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>
                {user.initials || user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onMenuClick?.("profile")}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onMenuClick?.("settings")}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onMenuClick?.("logout")}>
            <LogOut className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 px-2 py-2 h-auto"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              {user.initials || user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left">
            <span className="text-sm font-medium truncate">{user.name}</span>
            <span className="text-xs text-muted-foreground truncate">
              {user.email}
            </span>
          </div>
          <ChevronDown className="ml-auto h-4 w-4 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onMenuClick?.("profile")}>
          <User className="mr-2 h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMenuClick?.("settings")}>
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => onMenuClick?.("logout")}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Main Sidebar Component - Enhanced with better toggle functionality
export const Sidebar: React.FC<
  SidebarProps & { onItemClick?: (item: SidebarItem) => void }
> = ({
  items,
  user,
  onUserMenuClick,
  onItemClick,
  className,
  collapsible = true,
  title = "Navigation",
}) => {
  const { setIsOpen, isCollapsed, setIsCollapsed } = useSidebar();

  const sidebarContent = (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-4 py-3">
        {!isCollapsed && <h2 className="text-lg font-semibold">{title}</h2>}
        <div className="flex items-center gap-2">
          {/* Desktop collapse toggle */}
          {collapsible && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex"
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>
          )}
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation Items */}
      <ScrollArea className="flex-1 px-3 py-4">
        <div className="space-y-1">
          {items.map((item) => (
            <SidebarItemComponent
              key={item.id}
              item={item}
              onItemClick={onItemClick}
            />
          ))}
        </div>
      </ScrollArea>

      {/* User Menu */}
      {user && (
        <div className="border-t px-3 py-3">
          <UserMenu user={user} onMenuClick={onUserMenuClick} />
        </div>
      )}
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "hidden lg:flex h-screen flex-col border-r bg-background transition-all duration-300",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

// Layout Component - Enhanced with collapse support
export const SidebarLayout: React.FC<SidebarLayoutProps> = ({
  sidebar,
  children,
  className,
}) => {
  return (
    <SidebarProvider defaultCollapsed={false}>
      <div className={cn("flex h-screen overflow-hidden", className)}>
        {sidebar}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
};
