
import React from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Lock, Paintbrush } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { colorOptions } from "@/constants/deckCreator";
import { DeckFormValues } from "@/schemas/deckSchema";

interface DeckDetailsFormProps {
  form: UseFormReturn<DeckFormValues>;
  categories: any[];
  selectedColor: string;
  setActiveTab: (tab: string) => void;
}

const DeckDetailsForm: React.FC<DeckDetailsFormProps> = ({
  form,
  categories,
  selectedColor,
  setActiveTab,
}) => {
  return (
    <>
      <Card className={`overflow-hidden border-t-4 shadow-lg transition-all duration-200`} 
        style={{ borderTopColor: `var(--${selectedColor.replace('bg-', '')})`}}>
        <CardContent className="p-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input 
                      placeholder="Enter an engaging title for your deck..." 
                      className="text-2xl font-bold border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Briefly describe what this deck is about and its learning objectives..." 
                      className="min-h-[100px] resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center">
                        <Paintbrush className="h-4 w-4 mr-1" /> 
                        Deck Color
                      </FormLabel>
                      <div className="flex flex-wrap gap-2">
                        {colorOptions.map((color) => (
                          <div 
                            key={color.value}
                            className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 
                              ${field.value === color.value ? "ring-2 ring-ring ring-offset-2" : ""} 
                              ${color.className}`
                            }
                            onClick={() => form.setValue("color", color.value)}
                            title={color.label}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="mt-6">
              <FormField
                control={form.control}
                name="isPublic"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="flex items-center">
                        {field.value ? (
                          <Globe className="h-4 w-4 mr-2" />
                        ) : (
                          <Lock className="h-4 w-4 mr-2" />
                        )}
                        {field.value ? "Public Deck" : "Private Deck"}
                      </FormLabel>
                      <div className="text-sm text-muted-foreground">
                        {field.value
                          ? "Anyone can discover and duplicate this deck"
                          : "Only you can access this deck"}
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <Button 
                type="button" 
                onClick={() => {
                  if (form.getValues().title) {
                    setActiveTab("cards");
                  } else {
                    form.setError("title", { 
                      type: "manual", 
                      message: "Please enter a title before adding cards" 
                    });
                  }
                }}
                disabled={!form.getValues().title}
                className={selectedColor}
              >
                Continue to Cards
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Tips for an effective deck:</h3>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <li className="flex items-start">
            <Badge variant="outline" className="mr-2 mt-0.5">1</Badge>
            Keep cards simple with one concept per card
          </li>
          <li className="flex items-start">
            <Badge variant="outline" className="mr-2 mt-0.5">2</Badge>
            Use clear, concise language
          </li>
          <li className="flex items-start">
            <Badge variant="outline" className="mr-2 mt-0.5">3</Badge>
            Include relevant examples where possible
          </li>
          <li className="flex items-start">
            <Badge variant="outline" className="mr-2 mt-0.5">4</Badge>
            Add visual elements for better recall
          </li>
        </ul>
      </div>
    </>
  );
};

export default DeckDetailsForm;
