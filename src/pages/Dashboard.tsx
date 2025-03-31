
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import DeckCard, { DeckProps } from "@/components/DeckCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SeedButton } from "@/utils/seedDb";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Fetch user decks from Supabase
  const { data: decks = [], isLoading } = useQuery({
    queryKey: ["decks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Fetch user's decks
      const { data: userDecks, error: userDecksError } = await supabase
        .from("decks")
        .select(`
          *,
          cards:cards(count)
        `)
        .eq("user_id", user.id);
      
      if (userDecksError) {
        console.error("Error fetching user decks:", userDecksError);
        return [];
      }
      
      // Transform data to match DeckProps
      return userDecks.map(deck => ({
        id: deck.id,
        title: deck.title,
        description: deck.description || "",
        cardCount: deck.cards?.[0]?.count || 0,
        progress: 0, // We'll implement progress tracking later
        category: deck.category || "Uncategorized",
        color: deck.color,
        lastStudied: "Never", // This will be updated later
      }));
    },
    enabled: !!user,
  });

  // Fetch study progress statistics
  const { data: studyStats = { totalCards: 0, studiedToday: 0 } } = useQuery({
    queryKey: ["study-stats", user?.id],
    queryFn: async () => {
      if (!user) return { totalCards: 0, studiedToday: 0 };
      
      // Get total cards count
      const { data: totalCardsData, error: totalCardsError } = await supabase
        .from("cards")
        .select("deck_id", { count: 'exact' })
        .in("deck_id", decks.map(deck => deck.id));
      
      if (totalCardsError) {
        console.error("Error fetching total cards:", totalCardsError);
        return { totalCards: 0, studiedToday: 0 };
      }
      
      // For now, randomize the studied cards to show some progress
      // In a real implementation, we would track this in a separate table
      const totalCards = totalCardsData?.length || 0;
      const studiedToday = Math.floor(Math.random() * totalCards);
      
      return {
        totalCards,
        studiedToday: Math.min(studiedToday, totalCards)
      };
    },
    enabled: !!user && decks.length > 0,
  });

  // Fetch sample public decks if user has no decks
  const { data: publicDecks = [] } = useQuery({
    queryKey: ["public-decks"],
    queryFn: async () => {
      if (decks.length > 0) return [];
      
      const { data, error } = await supabase
        .from("decks")
        .select(`
          *,
          cards:cards(count)
        `)
        .eq("is_public", true)
        .limit(3);
      
      if (error) {
        console.error("Error fetching public decks:", error);
        return [];
      }
      
      return data.map(deck => ({
        id: deck.id,
        title: deck.title,
        description: deck.description || "",
        cardCount: deck.cards?.[0]?.count || 0,
        progress: 0,
        category: deck.category || "Uncategorized",
        color: deck.color,
        lastStudied: "Never",
      }));
    },
  });

  const handleDeckClick = (id: string) => {
    navigate(`/study/${id}`);
  };

  const createNewDeck = () => {
    navigate("/create");
  };

  // Filter decks for tabs
  const recentDecks = decks.filter(deck => 
    deck.lastStudied === "Today" || deck.lastStudied === "Yesterday"
  );

  // Calculate progress percentage
  const progressPercentage = studyStats.totalCards > 0
    ? Math.round((studyStats.studiedToday / studyStats.totalCards) * 100)
    : 0;

  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Decks</h1>
          <Button onClick={createNewDeck} size="sm" className="md:flex hidden">
            <PlusCircle className="mr-2 h-4 w-4" /> New Deck
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your decks...</p>
              </div>
            ) : decks.length > 0 ? (
              <div className="grid gap-4">
                {decks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    {...deck}
                    onClick={() => handleDeckClick(deck.id)}
                  />
                ))}
              </div>
            ) : publicDecks.length > 0 ? (
              <>
                <div className="text-center py-6">
                  <p className="text-muted-foreground mb-4">No decks yet. How about trying one of these?</p>
                  <Button onClick={createNewDeck} className="mb-6">Create Your First Deck</Button>
                  {user && <SeedButton userId={user.id} />}
                </div>
                <h2 className="font-medium mb-4">Recommended Decks</h2>
                <div className="grid gap-4">
                  {publicDecks.map((deck) => (
                    <DeckCard
                      key={deck.id}
                      {...deck}
                      onClick={() => handleDeckClick(deck.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No decks yet</p>
                <Button onClick={createNewDeck} className="mb-4">Create Your First Deck</Button>
                {user && (
                  <div className="mt-4">
                    <p className="text-muted-foreground mb-2">Or try our sample decks:</p>
                    <SeedButton userId={user.id} />
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          <TabsContent value="recent">
            {recentDecks.length > 0 ? (
              <div className="grid gap-4">
                {recentDecks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    {...deck}
                    onClick={() => handleDeckClick(deck.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No recently studied decks</p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="favorites">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No favorite decks yet</p>
            </div>
          </TabsContent>
        </Tabs>

        {decks.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 mb-6">
            <h2 className="font-medium mb-2">Study Progress</h2>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className="bg-primary h-2.5 rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Daily goal: {progressPercentage}%</span>
              <span>{studyStats.studiedToday}/{studyStats.totalCards} cards</span>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
