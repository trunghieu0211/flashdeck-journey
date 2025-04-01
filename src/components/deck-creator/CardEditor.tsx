
import React, { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ArrowRight, 
  Bold, 
  Italic, 
  Underline, 
  Image, 
  Code, 
  AlignLeft, 
  Eye,
  Heading1,
  ListOrdered,
  ListChecks,
  Music,
  FileSymlink,
  Sparkles
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { DeckFormValues } from "@/schemas/deckSchema";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";

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
  const [audioUrl, setAudioUrl] = useState("");
  const [showTips, setShowTips] = useState(true);
  const [previewFront, setPreviewFront] = useState("");
  const [previewBack, setPreviewBack] = useState("");
  
  // Update preview when content changes
  useEffect(() => {
    // Using template literals for form field names to make TypeScript happy
    const frontContent = form.getValues(`cards.${currentCardIndex}.front`);
    const backContent = form.getValues(`cards.${currentCardIndex}.back`);
    setPreviewFront(frontContent ? String(frontContent) : "");
    setPreviewBack(backContent ? String(backContent) : "");
  }, [form, currentCardIndex, editorTab]);

  // Simple text formatting functions
  const formatText = (formatType: string) => {
    // This is a simplified example - a real implementation would use a proper rich text editor
    const fieldName = `cards.${currentCardIndex}.front` as const;
    const currentValue = String(form.getValues(fieldName));
    
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
      case 'heading':
        formattedText = `# ${currentValue}`;
        break;
      case 'list':
        formattedText = `\n- Item 1\n- Item 2\n- Item 3\n`;
        break;
      case 'numbered-list':
        formattedText = `\n1. Step 1\n2. Step 2\n3. Step 3\n`;
        break;
    }
    
    form.setValue(fieldName, formattedText);
  };
  
  // Add image to card
  const addImage = () => {
    if (!imageUrl) return;
    
    const fieldName = `cards.${currentCardIndex}.front` as const;
    const currentValue = String(form.getValues(fieldName));
    const imageMarkdown = `\n![image](${imageUrl})\n`;
    
    form.setValue(fieldName, currentValue + imageMarkdown);
    setImageUrl("");
  };

  // Add audio to card
  const addAudio = () => {
    if (!audioUrl) return;
    
    const fieldName = `cards.${currentCardIndex}.front` as const;
    const currentValue = String(form.getValues(fieldName));
    const audioMarkdown = `\n<audio controls src="${audioUrl}"></audio>\n`;
    
    form.setValue(fieldName, currentValue + audioMarkdown);
    setAudioUrl("");
  };

  // Simple markdown to HTML converter for preview
  const renderMarkdown = (text: string) => {
    if (!text) return "";
    
    // Replace bold
    let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Replace underline
    html = html.replace(/_(.*?)_/g, '<u>$1</u>');
    
    // Replace code
    html = html.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Replace headers
    html = html.replace(/# (.*?)$/gm, '<h1>$1</h1>');
    
    // Replace ordered lists
    html = html.replace(/^\d+\. (.*)$/gm, '<li>$1</li>').replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
    
    // Replace unordered lists
    html = html.replace(/^- (.*)$/gm, '<li>$1</li>').replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
    
    // Replace images
    html = html.replace(/!\[image\]\((.*?)\)/g, '<img src="$1" alt="Card image" style="max-width: 100%;" />');
    
    // Replace new lines
    html = html.replace(/\n/g, '<br />');
    
    return html;
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

      {showTips && (
        <Alert variant="default" className="mb-4 bg-blue-50 border-blue-200">
          <AlertDescription className="text-sm">
            <strong>Tip:</strong> Create effective flashcards by keeping information concise, using imagery where helpful,
            and focusing on one concept per card.
            <Button 
              variant="link" 
              size="sm" 
              className="p-0 h-auto text-blue-600" 
              onClick={() => setShowTips(false)}
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="front" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="front">Front Side</TabsTrigger>
          <TabsTrigger value="back">Back Side</TabsTrigger>
          <TabsTrigger value="extras">Extras</TabsTrigger>
        </TabsList>
        
        <TabsContent value="front">
          <div className="space-y-4">
            <div className="bg-muted p-2 rounded-md flex flex-wrap items-center gap-2 overflow-x-auto">
              <ToggleGroup type="multiple" size="sm">
                <ToggleGroupItem value="bold" onClick={() => formatText('bold')} title="Bold">
                  <Bold className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="italic" onClick={() => formatText('italic')} title="Italic">
                  <Italic className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="underline" onClick={() => formatText('underline')} title="Underline">
                  <Underline className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="code" onClick={() => formatText('code')} title="Code">
                  <Code className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="heading" onClick={() => formatText('heading')} title="Heading">
                  <Heading1 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" onClick={() => formatText('list')} title="Bullet List">
                  <ListChecks className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="numbered-list" onClick={() => formatText('numbered-list')} title="Numbered List">
                  <ListOrdered className="h-4 w-4" />
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

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Music className="h-4 w-4 mr-1" />
                    Audio
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Insert Audio</h4>
                      <p className="text-sm text-muted-foreground">
                        Add an audio URL to insert into your card
                      </p>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="audioUrl">Audio URL</Label>
                      <Input 
                        id="audioUrl"
                        value={audioUrl} 
                        onChange={(e) => setAudioUrl(e.target.value)} 
                        placeholder="https://example.com/audio.mp3"
                      />
                    </div>
                    <Button 
                      type="button" 
                      size="sm" 
                      onClick={addAudio}
                      disabled={!audioUrl}
                    >
                      Insert Audio
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
            
            {editorTab === "write" ? (
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
            ) : (
              <div className="border rounded-md p-4 min-h-[150px] bg-white">
                {previewFront ? (
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(previewFront) }} />
                ) : (
                  <p className="text-muted-foreground">No content to preview</p>
                )}
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="back">
          <div className="space-y-4">
            <div className="bg-muted p-2 rounded-md flex items-center justify-between">
              <div className="text-sm text-muted-foreground">The back side contains the answer</div>
              
              <div className="flex items-center gap-2">
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

            {editorTab === "write" ? (
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
            ) : (
              <div className="border rounded-md p-4 min-h-[150px] bg-white">
                {previewBack ? (
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(previewBack) }} />
                ) : (
                  <p className="text-muted-foreground">No content to preview</p>
                )}
              </div>
            )}
          </div>
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

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <FileSymlink className="h-4 w-4 mr-1 text-primary" />
                Template Suggestions
              </h4>
              <div className="text-sm space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start text-left" onClick={() => {
                  form.setValue(`cards.${currentCardIndex}.front`, "What is the definition of ____?");
                  form.setValue(`cards.${currentCardIndex}.back`, "The definition is...");
                }}>
                  Definition Template
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left" onClick={() => {
                  form.setValue(`cards.${currentCardIndex}.front`, "Explain the concept of ____.");
                  form.setValue(`cards.${currentCardIndex}.back`, "This concept refers to...");
                }}>
                  Concept Explanation
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start text-left" onClick={() => {
                  form.setValue(`cards.${currentCardIndex}.front`, "Complete this: ____");
                  form.setValue(`cards.${currentCardIndex}.back`, "Complete answer");
                }}>
                  Fill-in-the-blank
                </Button>
              </div>
            </Card>

            <Card className="p-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Sparkles className="h-4 w-4 mr-1 text-primary" />
                Tips for Effective Cards
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground list-disc pl-5">
                <li>Keep information concise and focused</li>
                <li>Use visuals to enhance memory retention</li>
                <li>Create meaningful connections with examples</li>
                <li>Focus on one concept per card</li>
                <li>Use mnemonic devices in the notes section</li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-muted-foreground">
          Use formatting tools above for better readability
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
