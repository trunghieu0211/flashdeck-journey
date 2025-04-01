
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DeckFormValues } from "@/schemas/deckSchema";

interface CardEditorProps {
  form: UseFormReturn<DeckFormValues>;
  currentCardIndex: number;
  prevCard: () => void;
  nextCard: () => void;
}

const CardEditor: React.FC<CardEditorProps> = ({
  form,
  currentCardIndex,
  prevCard,
  nextCard,
}) => {
  return (
    <div className="md:col-span-3 space-y-4">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        
        <FormField
          control={form.control}
          name={`cards.${currentCardIndex}.notes`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes (Optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add memory tips or additional notes" 
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default CardEditor;
