
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// Dummy data for the deck to edit - in real app this would be fetched from API/database
const mockDeck = {
  id: "1",
  title: "Spanish Vocabulary",
  description: "Essential Spanish words and phrases for beginners",
  category: "Languages",
  color: "bg-primary",
  isPublic: true,
};

// Mock categories
const categories = [
  { id: "languages", name: "Languages" },
  { id: "science", name: "Science" },
  { id: "math", name: "Mathematics" },
  { id: "history", name: "History" },
  { id: "tech", name: "Technology" },
  { id: "arts", name: "Arts" },
];

const colorOptions = [
  { value: "bg-primary", label: "Blue" },
  { value: "bg-secondary", label: "Purple" },
  { value: "bg-green-500", label: "Green" },
  { value: "bg-red-500", label: "Red" },
  { value: "bg-yellow-500", label: "Yellow" },
  { value: "bg-orange-500", label: "Orange" },
  { value: "bg-pink-500", label: "Pink" },
];

const deckSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters long" }),
  category: z.string().min(1, { message: "Please select a category" }),
  color: z.string().min(1, { message: "Please select a color" }),
  isPublic: z.boolean(),
});

type DeckFormValues = z.infer<typeof deckSchema>;

const EditDeck: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const form = useForm<DeckFormValues>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      title: mockDeck.title,
      description: mockDeck.description,
      category: mockDeck.category.toLowerCase(),
      color: mockDeck.color,
      isPublic: mockDeck.isPublic,
    },
  });

  const onSubmit = async (values: DeckFormValues) => {
    try {
      console.log("Updated deck:", { id, ...values });
      
      toast({
        title: "Deck updated successfully!",
        description: "Your changes have been saved.",
      });
      
      // Navigate back to dashboard or deck view
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Failed to update deck",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Edit Deck</h1>
        </div>

        <Card>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Deck Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter deck title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter a brief description of this deck" 
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Deck Color</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-wrap gap-2"
                          >
                            {colorOptions.map((color) => (
                              <FormItem key={color.value} className="flex items-center space-x-1">
                                <FormControl>
                                  <RadioGroupItem 
                                    value={color.value} 
                                    id={color.value}
                                    className="sr-only"
                                  />
                                </FormControl>
                                <label
                                  htmlFor={color.value}
                                  className={`h-8 w-8 rounded-full cursor-pointer ring-offset-background transition-all hover:scale-110 ${
                                    field.value === color.value ? "ring-2 ring-ring ring-offset-2" : ""
                                  } ${color.value}`}
                                  title={color.label}
                                />
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Make this deck public</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Public decks can be viewed and imported by other users
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
                
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/dashboard")}
                  >
                    Cancel
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

export default EditDeck;
