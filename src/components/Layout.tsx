
import React from "react";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  LogOut,
  Settings,
  User,
  BookOpen,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  // Get user and signOut function from our auth hook
  const { user, signOut } = useAuth();
  
  const handleNavigation = (path: string) => {
    window.location.href = path;
  };
  
  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center">
            <a href="/dashboard" className="font-bold text-xl">FlashDeck</a>
          </div>
          <div className="flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full overflow-hidden"
                  >
                    <div className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-full">
                      {user.email?.charAt(0).toUpperCase() || <User className="w-4 h-4" />}
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="font-normal text-sm text-muted-foreground truncate">
                      {user.email}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleNavigation("/dashboard")}>
                    <BookOpen className="mr-2 h-4 w-4" /> My Decks
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("/create")}>
                    <Plus className="mr-2 h-4 w-4" /> Create Deck
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("/categories")}>
                    <BookOpen className="mr-2 h-4 w-4" /> Manage Categories
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleNavigation("/settings")}>
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => handleNavigation("/login")}>
                  Sign in
                </Button>
                <Button onClick={() => handleNavigation("/signup")}>Sign up</Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1">{children}</main>

      {/* Mobile navigation */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background md:hidden">
        <nav className="container flex justify-around py-3">
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center h-auto py-2"
            onClick={() => handleNavigation("/dashboard")}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs mt-1">Decks</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center h-auto py-2"
            onClick={() => handleNavigation("/create")}
          >
            <Plus className="h-5 w-5" />
            <span className="text-xs mt-1">Create</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="flex flex-col items-center justify-center h-auto py-2"
            onClick={() => handleNavigation("/settings")}
          >
            <Settings className="h-5 w-5" />
            <span className="text-xs mt-1">Settings</span>
          </Button>
        </nav>
      </div>
    </div>
  );
};

export default Layout;
