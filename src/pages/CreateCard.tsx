
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  front: z.string().min(1, {
    message: "Front side cannot be empty",
  }),
  back: z.string().min(1, {
    message: "Back side cannot be empty",
  }),
  example: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [deckId, setDeckId] = useState<string | null>(null);
  
  // Extract deck ID from URL query parameters
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const id = searchParams.get('deckId');
    setDeckId(id);
  }, [location]);
  
  // Fetch deck information if deckId is available
  const { data: deck } = useQuery({
    queryKey: ["deck", deckId],
    queryFn: async () => {
      if (!deckId) return null;
      
      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("id", deckId)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!deckId,
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      front: "",
      back: "",
      example: "",
      notes: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    if (!deckId) {
      toast({
        title: "Error",
        description: "No deck selected. Please return to deck selection.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    console.log("Creating card:", values);
    
    try {
      const { data, error } = await supabase
        .from("cards")
        .insert({
          deck_id: deckId,
          front: values.front,
          back: values.back,
          example: values.example || null,
          notes: values.notes || null
        })
        .select();
      
      if (error) throw error;
      
      toast({
        title: "Success!",
        description: "Your card has been added to the deck.",
      });
      
      // Clear the form for the next card
      form.reset({
        front: "",
        back: "",
        example: "",
        notes: "",
      });
      
      // Option to add another card or return to deck
      const addAnother = window.confirm("Card added successfully! Add another card?");
      if (!addAnother) {
        navigate(`/edit/deck/${deckId}`);
      }
      
    } catch (error) {
      console.error("Error creating card:", error);
      toast({
        title: "Failed to save card",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
    setFlipped(false);
  };

  // Fixed the navigation by ensuring we only navigate to a valid string path
  const handleGoBack = () => {
    if (deckId) {
      navigate(`/edit/deck/${deckId}`);
    } else {
      navigate(-1); // This is a number, which is valid
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-background pb-4 border-b">
          <div className="flex items-center">
            <Button 
              onClick={handleGoBack} 
              variant="ghost" 
              size="icon"
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Add New Card</h1>
              {deck && (
                <p className="text-sm text-muted-foreground">Deck: {deck.title}</p>
              )}
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button 
              onClick={form.handleSubmit(handleSubmit)} 
              disabled={isSaving}
            >
              {isSaving ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              )}
            </Button>
          </div>
        </div>
        
        {isPreview ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div 
              className="w-full h-64 max-w-md perspective-[1000px] cursor-pointer"
              onClick={() => setFlipped(!flipped)}
            >
              <div 
                className={`relative w-full h-full transition-all duration-700 transform-style-preserve-3d ${flipped ? "rotate-y-180" : ""}`}
              >
                <div className="absolute w-full h-full bg-white rounded-lg shadow-xl p-6 flex flex-col justify-center items-center backface-hidden">
                  <p className="text-xl font-medium">{form.getValues().front || "Front side"}</p>
                  <p className="text-sm text-muted-foreground mt-4">Click to flip card</p>
                </div>
                <div className="absolute w-full h-full bg-white rounded-lg shadow-xl p-6 flex flex-col justify-center items-center backface-hidden rotate-y-180">
                  <p className="text-xl">{form.getValues().back || "Back side"}</p>
                  {form.getValues().example && (
                    <div className="mt-4 p-2 bg-muted rounded-md w-full">
                      <p className="text-sm"><strong>Example:</strong> {form.getValues().example}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">Click on the card to flip</p>
          </div>
        ) : (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Front Side */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="front"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center mb-2">
                              <FormLabel className="text-lg font-medium">Front Side</FormLabel>
                            </div>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter front side content..." 
                                className="min-h-[150px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Back Side */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="back"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center mb-2">
                              <FormLabel className="text-lg font-medium">Back Side</FormLabel>
                            </div>
                            <FormControl>
                              <Textarea 
                                placeholder="Enter back side content..." 
                                className="min-h-[150px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="example"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Example (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter an example for better understanding..." 
                              className="min-h-[80px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Add notes, memory tips..." 
                              className="min-h-[80px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-end mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleGoBack} 
            className="mr-2"
          >
            Cancel
          </Button>
          <Button onClick={form.handleSubmit(handleSubmit)} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Card"}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCard;
