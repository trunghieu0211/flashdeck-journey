
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Trash2, ArrowLeft, ArrowRight, Save, Eye, Paintbrush, Lock, Globe } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { AnimatePresence, motion } from "framer-motion";

// Fetch real categories instead of using mock data
const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
      return data || [];
    }
  });
};

const colorOptions = [
  { value: "bg-primary", label: "Blue", className: "bg-primary" },
  { value: "bg-secondary", label: "Purple", className: "bg-secondary" },
  { value: "bg-green-500", label: "Green", className: "bg-green-500" },
  { value: "bg-red-500", label: "Red", className: "bg-red-500" },
  { value: "bg-yellow-500", label: "Yellow", className: "bg-yellow-500" },
  { value: "bg-orange-500", label: "Orange", className: "bg-orange-500" },
  { value: "bg-pink-500", label: "Pink", className: "bg-pink-500" },
];

const cardSchema = z.object({
  front: z.string().min(1, { message: "Front side text is required" }),
  back: z.string().min(1, { message: "Back side text is required" }),
  example: z.string().optional(),
  notes: z.string().optional(),
});

const deckSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters long" }),
  category: z.string().min(1, { message: "Please select a category" }),
  color: z.string().default("bg-primary"),
  isPublic: z.boolean().default(false),
  cards: z.array(cardSchema).min(1, { message: "Add at least one card to your deck" }),
});

type DeckFormValues = z.infer<typeof deckSchema>;

const IntegratedDeckCreator: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("deck");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const { data: categories = [] } = useCategories();

  const form = useForm<DeckFormValues>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      color: "bg-primary",
      isPublic: false,
      cards: [{ front: "", back: "", example: "", notes: "" }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  const onSubmit = async (values: DeckFormValues) => {
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your deck.",
          variant: "destructive",
        });
        return;
      }
      
      // Insert deck into Supabase
      const { data: deck, error: deckError } = await supabase
        .from("decks")
        .insert({
          title: values.title,
          description: values.description,
          category: values.category,
          color: values.color,
          is_public: values.isPublic,
          user_id: user.id
        })
        .select()
        .single();
      
      if (deckError) throw deckError;
      
      // Insert all cards
      const cardsToInsert = values.cards.map(card => ({
        deck_id: deck.id,
        front: card.front,
        back: card.back,
        example: card.example || null,
        notes: card.notes || null
      }));
      
      const { error: cardsError } = await supabase
        .from("cards")
        .insert(cardsToInsert);
      
      if (cardsError) throw cardsError;
      
      toast({
        title: "Deck created successfully!",
        description: `Created "${values.title}" with ${values.cards.length} cards.`,
      });
      
      // Navigate to dashboard
      window.location.href = "/dashboard";
      
    } catch (error) {
      console.error("Error creating deck:", error);
      toast({
        title: "Failed to create deck",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleAddCard = () => {
    append({ front: "", back: "", example: "", notes: "" });
    setCurrentCardIndex(fields.length);
    if (activeTab !== "cards") {
      setActiveTab("cards");
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    move(result.source.index, result.destination.index);
    if (currentCardIndex === result.source.index) {
      setCurrentCardIndex(result.destination.index);
    }
  };

  const nextCard = () => {
    if (currentCardIndex < fields.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      handleAddCard();
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
    setFlipped(false);
  };

  const selectedColor = form.watch("color") || "bg-primary";

  return (
    <Layout>
      <div className="container max-w-4xl mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Deck</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={togglePreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? "Edit" : "Preview"}
            </Button>
            <Button 
              onClick={form.handleSubmit(onSubmit)}
              className={selectedColor}
              variant="secondary"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Deck
            </Button>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="deck">Deck Details</TabsTrigger>
                <TabsTrigger value="cards" disabled={!form.getValues().title}>
                  Cards ({fields.length})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="deck">
                <Card className={`overflow-hidden border-t-4 shadow-lg transition-all duration-200`} 
                  style={{ borderTopColor: `var(--${selectedColor.replace('bg-', '')})`}}>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input 
                                placeholder="Enter an engaging title for your deck..." 
                                className="text-2xl font-bold border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                                {...field} 
                              />
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
                                placeholder="Briefly describe what this deck is about and its learning objectives..." 
                                className="min-h-[100px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                        
                        <div>
                          <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center">
                                  <Paintbrush className="h-4 w-4 mr-1" /> 
                                  Deck Color
                                </FormLabel>
                                <div className="flex flex-wrap gap-2">
                                  {colorOptions.map((color) => (
                                    <div 
                                      key={color.value}
                                      className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 
                                        ${field.value === color.value ? "ring-2 ring-ring ring-offset-2" : ""} 
                                        ${color.className}`
                                      }
                                      onClick={() => form.setValue("color", color.value)}
                                      title={color.label}
                                    />
                                  ))}
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <FormField
                          control={form.control}
                          name="isPublic"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="flex items-center">
                                  {field.value ? (
                                    <Globe className="h-4 w-4 mr-2" />
                                  ) : (
                                    <Lock className="h-4 w-4 mr-2" />
                                  )}
                                  {field.value ? "Public Deck" : "Private Deck"}
                                </FormLabel>
                                <div className="text-sm text-muted-foreground">
                                  {field.value
                                    ? "Anyone can discover and duplicate this deck"
                                    : "Only you can access this deck"}
                                </div>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="flex justify-end mt-6">
                        <Button 
                          type="button" 
                          onClick={() => {
                            if (form.getValues().title) {
                              setActiveTab("cards");
                            } else {
                              form.setError("title", { 
                                type: "manual", 
                                message: "Please enter a title before adding cards" 
                              });
                            }
                          }}
                          disabled={!form.getValues().title}
                          className={selectedColor}
                        >
                          Continue to Cards
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Tips for an effective deck:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                    <li className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-0.5">1</Badge>
                      Keep cards simple with one concept per card
                    </li>
                    <li className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-0.5">2</Badge>
                      Use clear, concise language
                    </li>
                    <li className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-0.5">3</Badge>
                      Include relevant examples where possible
                    </li>
                    <li className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-0.5">4</Badge>
                      Add visual elements for better recall
                    </li>
                  </ul>
                </div>
              </TabsContent>
              
              <TabsContent value="cards">
                {isPreview && fields.length > 0 ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <div className="mb-4 text-center">
                      <p className="text-muted-foreground">Card {currentCardIndex + 1} of {fields.length}</p>
                      <h2 className="text-2xl font-bold mt-1">{form.getValues().title}</h2>
                    </div>
                    
                    <div 
                      className="w-full max-w-lg h-72 perspective-1000 cursor-pointer mb-8"
                      onClick={() => setFlipped(!flipped)}
                    >
                      <div className={`relative w-full h-full transition-all duration-500 transform-style-preserve-3d ${flipped ? "rotate-y-180" : ""}`}>
                        <div className={`absolute w-full h-full bg-white rounded-xl shadow-xl p-8 flex flex-col justify-center items-center backface-hidden ${selectedColor} bg-opacity-10 border`}>
                          <div className="text-xl font-medium">{fields[currentCardIndex]?.front || "Front side"}</div>
                          <p className="text-sm text-muted-foreground mt-6">Click to flip card</p>
                        </div>
                        <div className="absolute w-full h-full bg-white rounded-xl shadow-xl p-8 flex flex-col justify-center items-center backface-hidden rotate-y-180 border">
                          <div className="text-xl">{fields[currentCardIndex]?.back || "Back side"}</div>
                          {fields[currentCardIndex]?.example && (
                            <div className="mt-4 p-3 bg-muted rounded-md w-full">
                              <p className="text-sm"><strong>Example:</strong> {fields[currentCardIndex]?.example}</p>
                            </div>
                          )}
                          {fields[currentCardIndex]?.notes && (
                            <div className="mt-2 p-3 bg-secondary/10 rounded-md w-full">
                              <p className="text-sm"><strong>Notes:</strong> {fields[currentCardIndex]?.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={prevCard}
                        disabled={currentCardIndex === 0}
                      >
                        <ArrowLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="text-sm text-center">
                        {fields.map((_, index) => (
                          <span 
                            key={index}
                            className={`inline-block w-2 h-2 mx-1 rounded-full cursor-pointer ${
                              index === currentCardIndex ? selectedColor : "bg-gray-300"
                            }`}
                            onClick={() => setCurrentCardIndex(index)}
                          />
                        ))}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={nextCard}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="mt-8 flex justify-between w-full max-w-md">
                      <Button
                        variant="outline"
                        onClick={togglePreview}
                      >
                        Return to Edit
                      </Button>
                      <Button onClick={form.handleSubmit(onSubmit)}>
                        Save Deck
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Card className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                      <div className="md:col-span-1 overflow-y-auto max-h-96 border rounded-md">
                        <DragDropContext onDragEnd={handleDragEnd}>
                          <Droppable droppableId="cards-list">
                            {(provided) => (
                              <ul
                                className="space-y-1 p-2"
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                              >
                                {fields.map((item, index) => (
                                  <Draggable key={item.id} draggableId={item.id} index={index}>
                                    {(provided) => (
                                      <li
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`p-2 text-sm border rounded cursor-pointer ${
                                          currentCardIndex === index ? "bg-primary text-white" : "hover:bg-muted"
                                        }`}
                                        onClick={() => setCurrentCardIndex(index)}
                                      >
                                        <div className="flex justify-between items-center">
                                          <span className="truncate">
                                            {index + 1}. {item.front || "(Empty)"}
                                          </span>
                                          <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className={`h-6 w-6 ${currentCardIndex === index ? "text-white" : "text-muted-foreground"}`}
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              if (fields.length > 1) {
                                                remove(index);
                                                if (currentCardIndex >= index && currentCardIndex > 0) {
                                                  setCurrentCardIndex(currentCardIndex - 1);
                                                }
                                              } else {
                                                toast({
                                                  title: "Cannot remove all cards",
                                                  description: "You must have at least one card in your deck.",
                                                  variant: "destructive",
                                                });
                                              }
                                            }}
                                          >
                                            <Trash2 className="h-3 w-3" />
                                          </Button>
                                        </div>
                                      </li>
                                    )}
                                  </Draggable>
                                ))}
                                {provided.placeholder}
                              </ul>
                            )}
                          </Droppable>
                        </DragDropContext>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full mt-2 border-dashed"
                          onClick={handleAddCard}
                        >
                          <PlusCircle className="h-4 w-4 mr-2" />
                          Add Card
                        </Button>
                      </div>
                      
                      <div className="md:col-span-3 space-y-4">
                        {fields[currentCardIndex] && (
                          <>
                            <div className="flex justify-between items-center mb-2">
                              <h3 className="text-lg font-medium">Card {currentCardIndex + 1}</h3>
                              <div className="flex gap-1">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={prevCard}
                                  disabled={currentCardIndex === 0}
                                >
                                  <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={nextCard}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <FormField
                              control={form.control}
                              name={`cards.${currentCardIndex}.front`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Front Side</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Enter the question or prompt" 
                                      className="min-h-[100px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={form.control}
                              name={`cards.${currentCardIndex}.back`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Back Side</FormLabel>
                                  <FormControl>
                                    <Textarea 
                                      placeholder="Enter the answer" 
                                      className="min-h-[100px]"
                                      {...field} 
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`cards.${currentCardIndex}.example`}
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
                                name={`cards.${currentCardIndex}.notes`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Notes (Optional)</FormLabel>
                                    <FormControl>
                                      <Textarea 
                                        placeholder="Add memory tips or additional notes" 
                                        className="min-h-[80px]"
                                        {...field} 
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("deck")}
                      >
                        Back to Deck Details
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={togglePreview}
                        className="mr-2"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button type="submit" className={selectedColor}>
                        <Save className="h-4 w-4 mr-2" />
                        Save Deck
                      </Button>
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default IntegratedDeckCreator;
