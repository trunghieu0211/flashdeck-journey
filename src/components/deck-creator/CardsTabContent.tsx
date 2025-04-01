
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Save } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DeckFormValues } from "@/schemas/deckSchema";
import CardList from "./CardList";
import CardEditor from "./CardEditor";
import CardPreview from "./CardPreview";

interface CardsTabContentProps {
  form: UseFormReturn<DeckFormValues>;
  fields: any[];
  currentCardIndex: number;
  setCurrentCardIndex: (index: number) => void;
  isPreview: boolean;
  flipped: boolean;
  setFlipped: (flipped: boolean) => void;
  selectedColor: string;
  remove: any;
  handleAddCard: () => void;
  handleDragEnd: (result: any) => void;
  prevCard: () => void;
  nextCard: () => void;
  togglePreview: () => void;
  setActiveTab: (tab: string) => void;
  onSubmit: (values: DeckFormValues) => Promise<void>;
}

const CardsTabContent: React.FC<CardsTabContentProps> = ({
  form,
  fields,
  currentCardIndex,
  setCurrentCardIndex,
  isPreview,
  flipped,
  setFlipped,
  selectedColor,
  remove,
  handleAddCard,
  handleDragEnd,
  prevCard,
  nextCard,
  togglePreview,
  setActiveTab,
  onSubmit,
}) => {
  if (isPreview && fields.length > 0) {
    return (
      <CardPreview 
        form={form}
        currentCardIndex={currentCardIndex}
        fields={fields}
        flipped={flipped}
        setFlipped={setFlipped}
        prevCard={prevCard}
        nextCard={nextCard}
        togglePreview={togglePreview}
        onSubmit={onSubmit}
        selectedColor={selectedColor}
      />
    );
  }

  return (
    <Card className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <CardList 
          fields={fields}
          currentCardIndex={currentCardIndex}
          setCurrentCardIndex={setCurrentCardIndex}
          remove={remove}
          handleAddCard={handleAddCard}
          handleDragEnd={handleDragEnd}
        />
        
        {fields[currentCardIndex] && (
          <CardEditor 
            form={form}
            currentCardIndex={currentCardIndex}
            prevCard={prevCard}
            nextCard={nextCard}
          />
        )}
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
  );
};

export default CardsTabContent;
