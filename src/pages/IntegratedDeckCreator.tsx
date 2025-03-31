
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import { PlusCircle, Trash2, ArrowLeft, ArrowRight, Save } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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

const cardSchema = z.object({
  front: z.string().min(1, { message: "Front side text is required" }),
  back: z.string().min(1, { message: "Back side text is required" }),
  example: z.string().optional(),
});

const deckSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters long" }),
  description: z.string().min(5, { message: "Description must be at least 5 characters long" }),
  category: z.string().min(1, { message: "Please select a category" }),
  color: z.string().default("bg-primary"),
  cards: z.array(cardSchema).min(1, { message: "Add at least one card to your deck" }),
});

type DeckFormValues = z.infer<typeof deckSchema>;

const IntegratedDeckCreator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("deck");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const form = useForm<DeckFormValues>({
    resolver: zodResolver(deckSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      color: "bg-primary",
      cards: [{ front: "", back: "", example: "" }],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  const onSubmit = async (values: DeckFormValues) => {
    try {
      console.log("Created deck:", values);
      
      toast({
        title: "Deck created successfully!",
        description: `Created "${values.title}" with ${values.cards.length} cards.`,
      });
      
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Failed to create deck",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleAddCard = () => {
    append({ front: "", back: "", example: "" });
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

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Create New Deck</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="deck">Deck Details</TabsTrigger>
                <TabsTrigger value="cards" disabled={!form.getValues().title}>Cards ({fields.length})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="deck">
                <Card className="p-6">
                  <div className="space-y-4">
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
                    
                    <div className="grid grid-cols-2 gap-4">
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
                          <FormItem>
                            <FormLabel>Deck Color</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a color" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {colorOptions.map((color) => (
                                  <SelectItem key={color.value} value={color.value}>
                                    <div className="flex items-center gap-2">
                                      <div className={`w-4 h-4 rounded-full ${color.value}`}></div>
                                      {color.label}
                                    </div>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
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
                      >
                        Continue to Cards
                      </Button>
                    </div>
                  </div>
                </Card>
              </TabsContent>
              
              <TabsContent value="cards">
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
                    <Button type="submit">
                      <Save className="h-4 w-4 mr-2" />
                      Save Deck
                    </Button>
                  </div>
                </Card>
              </TabsContent>
            </Tabs>
            
            {activeTab === "deck" && (
              <div className="flex justify-end">
                <Button type="submit">Save Deck</Button>
              </div>
            )}
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default IntegratedDeckCreator;
