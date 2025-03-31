
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to welcome page
    navigate("/");
  }, [navigate]);

  return null; // This component doesn't render anything as it immediately redirects
};

export default Index;
