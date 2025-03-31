
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Dummy data for the card to edit
const mockCard = {
  id: "1",
  deckId: "1",
  front: "¿Cómo estás?",
  back: "How are you?",
  example: "¿Cómo estás hoy? - How are you today?",
  notes: "Common greeting in Spanish",
};

const cardSchema = z.object({
  front: z.string().min(1, { message: "Front side text is required" }),
  back: z.string().min(1, { message: "Back side text is required" }),
  example: z.string().optional(),
  notes: z.string().optional(),
});

type CardFormValues = z.infer<typeof cardSchema>;

const EditCard: React.FC = () => {
  const navigate = useNavigate();
  const { id, deckId } = useParams<{ id: string; deckId: string }>();
  const { toast } = useToast();

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      front: mockCard.front,
      back: mockCard.back,
      example: mockCard.example,
      notes: mockCard.notes,
    },
  });

  const onSubmit = async (values: CardFormValues) => {
    try {
      console.log("Updated card:", { id, deckId, ...values });
      
      toast({
        title: "Card updated successfully!",
        description: "Your changes have been saved.",
      });
      
      // Navigate back to study deck or card list
      navigate(`/study/${deckId}`);
    } catch (error) {
      toast({
        title: "Failed to update card",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    const data = form.getValues();
    // Here you would show a preview of the card
    toast({
      title: "Card Preview",
      description: "Front: " + data.front + " | Back: " + data.back,
    });
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Card</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="front"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Front Side</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter the question or prompt" 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="back"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Back Side</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter the answer" 
                            className="min-h-[150px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="example"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Example (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter an example to help with context" 
                          className="min-h-[80px]"
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
                          placeholder="Enter any additional notes" 
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(`/study/${deckId}`)}
                  >
                    Cancel
                  </Button>
                  <Button type="button" variant="outline" onClick={handlePreview}>
                    Preview
                  </Button>
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default EditCard;
