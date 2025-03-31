
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, ArrowLeft, Save, Trash, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Card {
  id: string;
  front: string;
  back: string;
  example?: string;
}

const EditDeck: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch deck data
  const { data: deck, isLoading: isDeckLoading } = useQuery({
    queryKey: ["deck", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("decks")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load deck information",
          variant: "destructive",
        });
        throw error;
      }
      
      return data;
    },
  });

  // Fetch cards for this deck
  const { data: cards = [], isLoading: isCardsLoading, refetch: refetchCards } = useQuery({
    queryKey: ["cards", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cards")
        .select("*")
        .eq("deck_id", id)
        .order("created_at");
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load cards",
          variant: "destructive",
        });
        throw error;
      }
      
      return data as Card[];
    },
    enabled: !!id,
  });

  const handleAddCard = () => {
    // Navigate to card creation page with the deck ID
    navigate(`/create/card?deckId=${id}`);
  };

  const handleEditCard = (cardId: string) => {
    navigate(`/edit/card/${id}/${cardId}`);
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      const { error } = await supabase
        .from("cards")
        .delete()
        .eq("id", cardId);
      
      if (error) throw error;
      
      toast({
        title: "Card deleted",
        description: "The card has been removed from this deck.",
      });
      
      refetchCards();
    } catch (error) {
      toast({
        title: "Error deleting card",
        description: "There was a problem removing the card.",
        variant: "destructive",
      });
    }
  };

  if (isDeckLoading) {
    return (
      <Layout>
        <div className="container max-w-md mx-auto flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading deck information...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!deck) {
    return (
      <Layout>
        <div className="container max-w-md mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Deck not found</h2>
            <p className="text-muted-foreground mb-6">This deck doesn't exist or has been deleted.</p>
            <Button onClick={() => navigate("/dashboard")}>Return to Dashboard</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button onClick={() => navigate("/dashboard")} variant="ghost" size="icon" className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">{isEditing ? "Edit Deck" : deck.title}</h1>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit className="h-4 w-4 mr-2" /> Edit Deck
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(false)} variant="outline">
              <Save className="h-4 w-4 mr-2" /> Save Changes
            </Button>
          )}
        </div>

        {isEditing ? (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-1">
                    Title
                  </label>
                  <Input
                    id="title"
                    defaultValue={deck.title}
                    className="w-full"
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    defaultValue={deck.description}
                    className="w-full min-h-[100px]"
                  />
                </div>
                {/* Additional fields can be added here */}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">{deck.description}</p>
              <div className="flex space-x-2 mb-4">
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Cards:</span> {cards.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium">Category:</span> {deck.category || "Uncategorized"}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="cards" className="mb-6">
          <TabsList>
            <TabsTrigger value="cards">Cards</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="cards">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Flashcards ({cards.length})</h2>
              <Button onClick={handleAddCard}>
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </div>

            {isCardsLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading cards...</p>
              </div>
            ) : cards.length > 0 ? (
              <div className="space-y-4">
                {cards.map((card) => (
                  <Card key={card.id} className="overflow-hidden">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Front</h3>
                          <p className="text-base">{card.front}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Back</h3>
                          <p className="text-base">{card.back}</p>
                        </div>
                      </div>
                      {card.example && (
                        <div className="mt-3 pt-3 border-t">
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Example</h3>
                          <p className="text-sm">{card.example}</p>
                        </div>
                      )}
                      <div className="flex justify-end mt-3 pt-3 border-t">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditCard(card.id)}
                          className="mr-2"
                        >
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-muted-foreground mb-4">No cards in this deck yet</p>
                <Button onClick={handleAddCard}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Card
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Deck Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Public Deck</label>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={deck.is_public}
                        className="rounded border-gray-300"
                      />
                      <span className="ml-2 text-sm text-muted-foreground">
                        Make this deck visible to others
                      </span>
                    </div>
                  </div>
                  <div>
                    <Button variant="destructive" size="sm">
                      <Trash className="h-4 w-4 mr-2" />
                      Delete Deck
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={() => navigate(`/study/${id}`)}>Start Study Session</Button>
        </div>
      </div>
    </Layout>
  );
};

export default EditDeck;
