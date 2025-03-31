
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FlashcardProps {
  id: string;
  front: string;
  back: string;
  example?: string;
  difficulty?: "easy" | "medium" | "hard";
  onDifficultySelect?: (difficulty: string) => void;
}

const Flashcard: React.FC<FlashcardProps> = ({
  front,
  back,
  example,
  difficulty,
  onDifficultySelect,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    if (!isFlipped) {
      setIsAnswerRevealed(true);
    }
  };

  const handleDifficultySelect = (selectedDifficulty: string) => {
    if (onDifficultySelect) {
      onDifficultySelect(selectedDifficulty);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <Card
        className={cn(
          "w-full h-72 sm:h-80 md:h-96 cursor-pointer perspective-1000 mb-4",
          isFlipped ? "animate-card-flip" : ""
        )}
        onClick={handleFlip}
      >
        <div className={cn("flashcard", isFlipped ? "flipped" : "")}>
          <div className="flashcard-front flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl font-bold mb-4">{front}</h3>
            <p className="text-sm text-muted-foreground">Tap to reveal answer</p>
          </div>
          <div className="flashcard-back flex flex-col">
            <h4 className="text-xl font-semibold mb-2 text-center">Answer:</h4>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-lg">{back}</p>
            </div>
            {example && (
              <div className="mt-4 text-sm text-muted-foreground">
                <strong>Example:</strong> {example}
              </div>
            )}
          </div>
        </div>
      </Card>

      {isAnswerRevealed && (
        <div className="mt-auto animate-fade-in">
          <p className="text-center mb-3">How well did you know this?</p>
          <div className="flex justify-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex-1 border-destructive hover:border-destructive",
                difficulty === "hard" && "bg-destructive text-white"
              )}
              onClick={() => handleDifficultySelect("hard")}
            >
              Hard
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex-1 border-orange-400 hover:border-orange-400",
                difficulty === "medium" && "bg-orange-400 text-white"
              )}
              onClick={() => handleDifficultySelect("medium")}
            >
              Medium
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "flex-1 border-green-500 hover:border-green-500",
                difficulty === "easy" && "bg-green-500 text-white"
              )}
              onClick={() => handleDifficultySelect("easy")}
            >
              Easy
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcard;
