
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Flashcard, { FlashcardProps } from "@/components/Flashcard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const StudyDeck: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  // Mock data
  const [deck] = useState({
    id: id || "1",
    title: "Spanish Vocabulary",
    description: "Essential Spanish words and phrases for beginners",
    category: "Languages",
  });

  const [cards] = useState<FlashcardProps[]>([
    {
      id: "card1",
      front: "¿Cómo estás?",
      back: "How are you?",
      example: "¿Cómo estás hoy? (How are you today?)",
    },
    {
      id: "card2",
      front: "Buenos días",
      back: "Good morning",
      example: "Buenos días, ¿cómo amaneciste? (Good morning, how did you wake up?)",
    },
    {
      id: "card3",
      front: "Gracias",
      back: "Thank you",
      example: "Muchas gracias por tu ayuda. (Thank you very much for your help.)",
    },
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [cardStates, setCardStates] = useState<Record<string, { difficulty?: string }>>({});
  const [sessionCompleted, setSessionCompleted] = useState(false);

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
    setCardStates({
      ...cardStates,
      [cards[currentCardIndex].id]: { difficulty },
    });
  };

  const handleFinishSession = () => {
    navigate("/dashboard");
  };

  const currentCard = cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / cards.length) * 100;

  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-4">
          <button onClick={() => navigate("/dashboard")} className="text-muted-foreground">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-xl font-semibold">{deck.title}</h1>
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
