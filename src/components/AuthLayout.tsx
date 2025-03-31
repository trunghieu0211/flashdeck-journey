
import React from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <header className="py-4 px-6 border-b bg-background">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <span className="bg-primary text-white p-1 rounded">FD</span>
            <span>FlashDeck</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="container max-w-md">{children}</div>
      </main>

      <footer className="py-4 px-6 border-t bg-background text-center text-sm text-muted-foreground">
        <div className="container">
          <p>© {new Date().getFullYear()} FlashDeck. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
