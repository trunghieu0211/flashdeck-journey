
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import DeckForm from "@/components/DeckForm";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const CreateDeck: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (values: any) => {
    console.log("Creating deck:", values);
    
    // In a real app, this would save to a database
    // For now, we'll just show a success message and navigate back
    
    toast({
      title: "Deck created!",
      description: "Your new deck has been created successfully.",
    });
    
    navigate("/dashboard");
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-6 pb-20">
        <div className="flex items-center mb-6">
          <button 
            onClick={() => navigate(-1)} 
            className="mr-3 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Create New Deck</h1>
        </div>
        
        <DeckForm onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default CreateDeck;
