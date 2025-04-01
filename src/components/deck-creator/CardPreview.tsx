
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DeckFormValues } from "@/schemas/deckSchema";

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
  return (
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
  );
};

export default CardPreview;
