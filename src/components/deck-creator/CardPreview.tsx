
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, RotateCcw, Save } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DeckFormValues } from "@/schemas/deckSchema";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";

interface CardPreviewProps {
  form: UseFormReturn<DeckFormValues>;
  currentCardIndex: number;
  fields: any[];
  flipped: boolean;
  setFlipped: (flipped: boolean) => void;
  prevCard: () => void;
  nextCard: () => void;
  togglePreview: () => void;
  onSubmit: (values: DeckFormValues) => Promise<void>;
  selectedColor: string;
  setCurrentCardIndex: (index: number) => void;
}

const CardPreview: React.FC<CardPreviewProps> = ({
  form,
  currentCardIndex,
  fields,
  flipped,
  setFlipped,
  prevCard,
  nextCard,
  togglePreview,
  onSubmit,
  selectedColor,
  setCurrentCardIndex,
}) => {
  // Animation state for card flipping
  const [isFlipping, setIsFlipping] = useState(false);
  
  const handleFlip = () => {
    setIsFlipping(true);
    setFlipped(!flipped);
    setTimeout(() => setIsFlipping(false), 300); // Match this with CSS transition duration
  };
  
  // Progress calculation
  const filledCards = fields.filter(field => 
    field.front?.trim() && field.back?.trim()
  ).length;
  
  const progressPercentage = fields.length > 0 
    ? Math.round((filledCards / fields.length) * 100) 
    : 0;

  return (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="mb-6 text-center">
        <p className="text-muted-foreground">
          Card {currentCardIndex + 1} of {fields.length}
        </p>
        <h2 className="text-2xl font-bold mt-1">
          {form.getValues().title}
        </h2>
        <div className="mt-4 flex items-center justify-center">
          <Progress value={progressPercentage} className="w-60 h-2" />
          <span className="text-xs text-muted-foreground ml-2">
            {progressPercentage}%
          </span>
        </div>
      </div>
      
      <div className="perspective-1000 w-full max-w-md mx-auto mb-8">
        <Card 
          className={`relative w-full aspect-[4/3] cursor-pointer transition-transform duration-300 transform-style-preserve-3d ${
            isFlipping ? 'animate-pulse' : ''
          } ${flipped ? "rotate-y-180" : ""}`}
          onClick={handleFlip}
        >
          {/* Front of card */}
          <div 
            className={`absolute inset-0 backface-hidden p-8 flex flex-col justify-center items-center ${
              selectedColor} bg-opacity-10 border rounded-xl`}
          >
            <div className="text-xl font-medium text-center max-w-full break-words">
              {fields[currentCardIndex]?.front || "Front side"}
            </div>
            <div className="absolute bottom-4 right-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Tap to flip
              </Button>
            </div>
          </div>
          
          {/* Back of card */}
          <div 
            className="absolute inset-0 backface-hidden rotate-y-180 bg-white p-8 flex flex-col justify-center items-center border rounded-xl"
          >
            <div className="text-xl max-w-full break-words text-center">
              {fields[currentCardIndex]?.back || "Back side"}
            </div>
            
            {fields[currentCardIndex]?.example && (
              <div className="mt-6 p-3 bg-muted rounded-md w-full">
                <p className="text-sm">
                  <strong>Example:</strong> {fields[currentCardIndex]?.example}
                </p>
              </div>
            )}
            
            {fields[currentCardIndex]?.notes && (
              <div className="mt-3 p-3 bg-secondary/10 rounded-md w-full">
                <p className="text-sm">
                  <strong>Notes:</strong> {fields[currentCardIndex]?.notes}
                </p>
              </div>
            )}
            
            <div className="absolute bottom-4 right-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Tap to flip
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={prevCard}
          disabled={currentCardIndex === 0}
          className="rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        
        <div className="text-sm text-center flex items-center">
          {fields.map((_, index) => (
            <span 
              key={index}
              className={`inline-block w-2 h-2 mx-1 rounded-full cursor-pointer transition-all hover:scale-125 ${
                index === currentCardIndex ? selectedColor : "bg-gray-300"
              }`}
              onClick={() => setCurrentCardIndex(index)}
            />
          ))}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={nextCard}
          className="rounded-full"
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
        <Button onClick={form.handleSubmit(onSubmit)} className={selectedColor}>
          <Save className="h-4 w-4 mr-2" />
          Save Deck
        </Button>
      </div>
    </div>
  );
};

export default CardPreview;
