
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "@/components/Layout";
import Flashcard, { FlashcardProps } from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const StudyDeck: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardStates, setCardStates] = useState<Record<string, { difficulty?: string }>>({});
  const [sessionCompleted, setSessionCompleted] = useState(false);

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
  const { data: cards = [], isLoading: isCardsLoading } = useQuery({
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
          description: "Failed to load flashcards",
          variant: "destructive",
        });
        throw error;
      }
      
      return data as FlashcardProps[];
    },
    enabled: !!id,
  });

  const isLoading = isDeckLoading || isCardsLoading;

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setSessionCompleted(true);
    }
  };

  const handleDifficultySelect = (difficulty: string) => {
    if (cards[currentCardIndex]) {
      setCardStates({
        ...cardStates,
        [cards[currentCardIndex].id]: { difficulty },
      });
    }
  };

  const handleFinishSession = () => {
    navigate("/dashboard");
  };

  const handleAddCards = () => {
    navigate(`/create/card?deckId=${id}`);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-md mx-auto flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading flashcards...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!deck || cards.length === 0) {
    return (
      <Layout>
        <div className="container max-w-md mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No cards found</h2>
            <p className="text-muted-foreground mb-6">This deck doesn't have any flashcards yet.</p>
            <Button onClick={handleAddCards}>Add Cards to Deck</Button>
            <Button variant="outline" className="ml-2" onClick={() => navigate("/dashboard")}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">{deck?.title}</h1>
          <div className="w-5"></div> {/* Placeholder for alignment */}
        </div>

        <Progress value={progress} className="mb-6" />

        {!sessionCompleted ? (
          <>
            <div className="mb-6">
              <Flashcard
                {...currentCard}
                difficulty={cardStates[currentCard.id]?.difficulty as "easy" | "medium" | "hard"}
                onDifficultySelect={handleDifficultySelect}
              />
            </div>

            <div className="flex justify-between mt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentCardIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              <Button onClick={handleNext}>
                {currentCardIndex === cards.length - 1 ? "Finish" : "Next"}{" "}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="text-center text-sm text-muted-foreground mt-4">
              {currentCardIndex + 1} of {cards.length} cards
            </div>
          </>
        ) : (
          <div className="text-center py-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">Session Completed!</h2>
            <p className="mb-6">
              You've completed all {cards.length} cards in this deck.
            </p>

            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h3 className="font-medium mb-2">Session Summary</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className={cn("p-2 rounded-md text-center", "bg-green-100 text-green-700")}>
                  <div className="text-2xl font-bold">
                    {Object.values(cardStates).filter(
                      (s) => s.difficulty === "easy"
                    ).length}
                  </div>
                  <div className="text-xs">Easy</div>
                </div>
                <div className={cn("p-2 rounded-md text-center", "bg-orange-100 text-orange-700")}>
                  <div className="text-2xl font-bold">
                    {Object.values(cardStates).filter(
                      (s) => s.difficulty === "medium"
                    ).length}
                  </div>
                  <div className="text-xs">Medium</div>
                </div>
                <div className={cn("p-2 rounded-md text-center", "bg-red-100 text-red-700")}>
                  <div className="text-2xl font-bold">
                    {Object.values(cardStates).filter(
                      (s) => s.difficulty === "hard"
                    ).length}
                  </div>
                  <div className="text-xs">Hard</div>
                </div>
              </div>
            </div>

            <Button onClick={handleFinishSession}>Return to Dashboard</Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudyDeck;
