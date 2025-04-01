
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Eye, Save, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useCategories } from "@/hooks/useCategories";
import { deckSchema, DeckFormValues } from "@/schemas/deckSchema";
import { useNavigate } from "react-router-dom";
import DeckDetailsForm from "@/components/deck-creator/DeckDetailsForm";
import CardsTabContent from "@/components/deck-creator/CardsTabContent";

const IntegratedDeckCreator: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("deck");
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [saving, setSaving] = useState(false);
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
    mode: "onChange",
  });

  // Get form values for autosave
  const formValues = form.watch();

  // Autosave to localStorage
  useEffect(() => {
    const saveTimer = setTimeout(() => {
      localStorage.setItem('deckDraft', JSON.stringify(formValues));
    }, 2000);

    return () => clearTimeout(saveTimer);
  }, [formValues]);

  // Load draft from localStorage
  useEffect(() => {
    const savedDraft = localStorage.getItem('deckDraft');
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        form.reset(parsedDraft);
      } catch (e) {
        console.error("Error loading draft:", e);
      }
    }
  }, []);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "cards",
  });

  const onSubmit = async (values: DeckFormValues) => {
    try {
      setSaving(true);
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your deck.",
          variant: "destructive",
        });
        setSaving(false);
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
      
      // Clear the draft
      localStorage.removeItem('deckDraft');
      
      // Navigate to dashboard
      navigate("/dashboard");
      
    } catch (error) {
      console.error("Error creating deck:", error);
      toast({
        title: "Failed to create deck",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
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
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate("/dashboard")}
              className="rounded-full"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Create New Deck</h1>
          </div>
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
              disabled={saving}
            >
              {saving ? (
                <>
                  <div className="spinner h-4 w-4 mr-2 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Deck
                </>
              )}
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
                <DeckDetailsForm 
                  form={form} 
                  categories={categories} 
                  selectedColor={selectedColor} 
                  setActiveTab={setActiveTab} 
                />
              </TabsContent>
              
              <TabsContent value="cards">
                <CardsTabContent
                  form={form}
                  fields={fields}
                  currentCardIndex={currentCardIndex}
                  setCurrentCardIndex={setCurrentCardIndex}
                  isPreview={isPreview}
                  flipped={flipped}
                  setFlipped={setFlipped}
                  selectedColor={selectedColor}
                  remove={remove}
                  handleAddCard={handleAddCard}
                  handleDragEnd={handleDragEnd}
                  prevCard={prevCard}
                  nextCard={nextCard}
                  togglePreview={togglePreview}
                  setActiveTab={setActiveTab}
                  onSubmit={onSubmit}
                />
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </div>
    </Layout>
  );
};

export default IntegratedDeckCreator;
