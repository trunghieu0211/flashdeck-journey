
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-4">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! We couldn't find that page.
        </p>
        <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
      </div>
    </div>
  );
};

export default NotFound;
