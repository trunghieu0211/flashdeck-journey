
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, BookOpen, PlusSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  hideNavigation?: boolean;
}

const Layout = ({ children, hideNavigation = false }: LayoutProps) => {
  const location = useLocation();
  const path = location.pathname;

  const navigation = [
    { name: "Home", href: "/dashboard", icon: Home },
    { name: "Study", href: "/study", icon: BookOpen },
    { name: "Create", href: "/create", icon: PlusSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>

      {!hideNavigation && (
        <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-10">
          <div className="max-w-md mx-auto px-6">
            <div className="flex justify-around py-3">
              {navigation.map((item) => {
                const isActive = path === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex flex-col items-center p-2 rounded-lg",
                      isActive
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <item.icon
                      className={cn("h-6 w-6", isActive && "animate-pulse-soft")}
                    />
                    <span className="text-xs mt-1">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
