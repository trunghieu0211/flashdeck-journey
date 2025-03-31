
import React from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import CardForm from "@/components/CardForm";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

const CreateCard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (values: any) => {
    console.log("Creating card:", values);
    
    // In a real app, this would save to a database
    // For now, we'll just show a success message
    
    toast({
      title: "Card created!",
      description: "Your new flashcard has been added to the deck.",
    });
    
    // Reset form or navigate as needed
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
          <h1 className="text-2xl font-bold">Add New Card</h1>
        </div>
        
        <CardForm onSubmit={handleSubmit} />
      </div>
    </Layout>
  );
};

export default CreateCard;
