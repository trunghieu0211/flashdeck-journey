
import React, { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Bold, Italic, Underline, Image, Code, AlignLeft } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DeckFormValues } from "@/schemas/deckSchema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  const [editorTab, setEditorTab] = useState("write");
  const [imageUrl, setImageUrl] = useState("");
  
  // Simple text formatting functions (would be enhanced with a real rich text editor in production)
  const formatText = (formatType: string) => {
    // This is a simplified example - a real implementation would use a proper rich text editor
    const field = `cards.${currentCardIndex}.front`;
    const currentValue = form.getValues(field) as string;
    
    let formattedText = currentValue;
    switch (formatType) {
      case 'bold':
        formattedText = `**${currentValue}**`;
        break;
      case 'italic':
        formattedText = `*${currentValue}*`;
        break;
      case 'underline':
        formattedText = `_${currentValue}_`;
        break;
      case 'code':
        formattedText = `\`${currentValue}\``;
        break;
    }
    
    form.setValue(field, formattedText);
  };
  
  const addImage = () => {
    if (!imageUrl) return;
    
    const field = `cards.${currentCardIndex}.front`;
    const currentValue = form.getValues(field) as string;
    const imageMarkdown = `\n![image](${imageUrl})\n`;
    
    form.setValue(field, currentValue + imageMarkdown);
    setImageUrl("");
  };

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

      <Tabs defaultValue="front" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="front">Front Side</TabsTrigger>
          <TabsTrigger value="back">Back Side</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
        </TabsList>
        
        <TabsContent value="front">
          <div className="space-y-4">
            <div className="bg-muted p-2 rounded-md flex items-center gap-2 overflow-x-auto">
              <ToggleGroup type="multiple" size="sm">
                <ToggleGroupItem value="bold" onClick={() => formatText('bold')}>
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" onClick={() => formatText('italic')}>
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" onClick={() => formatText('underline')}>
                  <Underline className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="code" onClick={() => formatText('code')}>
                  <Code className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Image className="h-4 w-4 mr-1" />
                    Image
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Insert Image</h4>
                      <p className="text-sm text-muted-foreground">
                        Add an image URL to insert into your card
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="imageUrl">Image URL</Label>
                      <Input 
                        id="imageUrl"
                        value={imageUrl} 
                        onChange={(e) => setImageUrl(e.target.value)} 
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={addImage}
                      disabled={!imageUrl}
                    >
                      Insert Image
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <div className="ml-auto flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setEditorTab("write")} className={editorTab === "write" ? "bg-secondary" : ""}>
                  <AlignLeft className="h-4 w-4 mr-1" />
                  Write
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setEditorTab("preview")} className={editorTab === "preview" ? "bg-secondary" : ""}>
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>
            </div>
            
            <FormField
              control={form.control}
              name={`cards.${currentCardIndex}.front`}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter the question or prompt" 
                      className="min-h-[150px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="back">
          <FormField
            control={form.control}
            name={`cards.${currentCardIndex}.back`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea 
                    placeholder="Enter the answer" 
                    className="min-h-[150px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </TabsContent>
        
        <TabsContent value="extras">
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
                  <FormLabel>Memory Tips (Optional)</FormLabel>
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
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-muted-foreground">
          Tip: Use simple formatting for better readability
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={prevCard}
            disabled={currentCardIndex === 0}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={nextCard}
          >
            {currentCardIndex === form.getValues().cards.length - 1 ? "Add New Card" : "Next Card"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CardEditor;
