
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, FileText, Upload } from "lucide-react";

interface CSVCard {
  front: string;
  back: string;
  example?: string;
}

const ImportCSV: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [cards, setCards] = useState<CSVCard[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [deckName, setDeckName] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        parseCSV(selectedFile);
      } else {
        toast({
          title: "Invalid file type",
          description: "Please upload a CSV file.",
          variant: "destructive",
        });
      }
    }
  };

  const parseCSV = (file: File) => {
    setIsProcessing(true);
    setParseError(null);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Validate required headers
        const frontIndex = headers.findIndex(h => h.toLowerCase() === 'front');
        const backIndex = headers.findIndex(h => h.toLowerCase() === 'back');
        const exampleIndex = headers.findIndex(h => h.toLowerCase() === 'example');
        
        if (frontIndex === -1 || backIndex === -1) {
          throw new Error("CSV must contain 'front' and 'back' columns");
        }
        
        const parsedCards: CSVCard[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue; // Skip empty lines
          
          const values = parseCSVLine(lines[i]);
          
          if (values.length >= 2) {
            const card: CSVCard = {
              front: values[frontIndex]?.trim() || "",
              back: values[backIndex]?.trim() || "",
            };
            
            if (exampleIndex !== -1 && values[exampleIndex]) {
              card.example = values[exampleIndex].trim();
            }
            
            if (card.front && card.back) {
              parsedCards.push(card);
            }
          }
        }
        
        if (parsedCards.length === 0) {
          throw new Error("No valid cards found in the CSV");
        }
        
        setCards(parsedCards);
        
        // Try to extract a deck name from the file name
        const fileName = file.name.replace('.csv', '');
        setDeckName(fileName);
        
      } catch (error) {
        setParseError((error as Error).message);
        toast({
          title: "Error parsing CSV",
          description: (error as Error).message,
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.onerror = () => {
      setParseError("Error reading the file");
      setIsProcessing(false);
      toast({
        title: "Error reading file",
        description: "There was a problem reading the file.",
        variant: "destructive",
      });
    };
    
    reader.readAsText(file);
  };

  // Helper function to parse CSV line properly (handles quoted values with commas)
  const parseCSVLine = (line: string): string[] => {
    const result = [];
    let current = "";
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current);
        current = "";
      } else {
        current += char;
      }
    }
    
    result.push(current); // Add the last field
    return result;
  };

  const handleImport = () => {
    if (!deckName.trim()) {
      toast({
        title: "Deck name required",
        description: "Please enter a name for your deck.",
        variant: "destructive",
      });
      return;
    }
    
    if (cards.length === 0) {
      toast({
        title: "No cards to import",
        description: "Please upload a valid CSV file first.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Here we would normally save to database (Supabase)
      console.log("Importing deck:", deckName);
      console.log("Cards:", cards);
      
      toast({
        title: "Import successful",
        description: `Created new deck "${deckName}" with ${cards.length} cards.`,
      });
      
      // Navigate to dashboard
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Import failed",
        description: "There was an error importing your deck.",
        variant: "destructive",
      });
    }
  };

  const downloadTemplate = () => {
    const template = "front,back,example\nWhat is the capital of France?,Paris,The Eiffel Tower is located in Paris.\n";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flashcards_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Import Flashcards</h1>
        </div>

        <Tabs defaultValue="import" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="import">Import</TabsTrigger>
            <TabsTrigger value="instructions">Instructions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="import">
            <Card>
              <CardHeader>
                <CardTitle>Import from CSV</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="deckName">Deck Name</Label>
                    <Input
                      id="deckName"
                      value={deckName}
                      onChange={(e) => setDeckName(e.target.value)}
                      placeholder="Enter deck name"
                    />
                  </div>
                  
                  <div className="grid w-full items-center gap-2">
                    <Label htmlFor="csvFile">Upload CSV File</Label>
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md p-6 hover:bg-muted/50 cursor-pointer">
                      <input
                        id="csvFile"
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                      <label htmlFor="csvFile" className="cursor-pointer text-center">
                        <Upload className="h-8 w-8 mb-2 mx-auto text-muted-foreground" />
                        <p className="text-sm font-medium mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground">
                          CSV file with front, back, and example columns
                        </p>
                      </label>
                    </div>
                  </div>

                  {parseError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{parseError}</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={downloadTemplate}>
                      <FileText className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                    <Button type="button" onClick={handleImport} disabled={cards.length === 0 || !deckName.trim()}>
                      Import {cards.length} Cards
                    </Button>
                  </div>
                </div>

                {isProcessing ? (
                  <div className="text-center py-8">
                    <p>Processing file...</p>
                  </div>
                ) : cards.length > 0 ? (
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">#</TableHead>
                          <TableHead>Front</TableHead>
                          <TableHead>Back</TableHead>
                          <TableHead>Example</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {cards.slice(0, 10).map((card, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell className="max-w-[150px] truncate">
                              {card.front}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">
                              {card.back}
                            </TableCell>
                            <TableCell className="max-w-[150px] truncate">
                              {card.example || "-"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    {cards.length > 10 && (
                      <div className="text-center p-2 bg-muted/50 text-sm">
                        Showing 10 of {cards.length} cards
                      </div>
                    )}
                  </div>
                ) : null}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="instructions">
            <Card>
              <CardHeader>
                <CardTitle>CSV Format Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p>
                  To import flashcards, prepare a CSV file with the following columns:
                </p>
                
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>front</strong> - The question or prompt (required)</li>
                  <li><strong>back</strong> - The answer (required)</li>
                  <li><strong>example</strong> - An example or context (optional)</li>
                </ul>
                
                <Alert>
                  <AlertTitle className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Example CSV Format
                  </AlertTitle>
                  <AlertDescription>
                    <pre className="mt-2 p-2 bg-muted rounded-md overflow-x-auto">
                      front,back,example<br />
                      "What is the capital of France?","Paris","The Eiffel Tower is located in Paris."<br />
                      "Bonjour means...","Hello","Bonjour is a common French greeting."
                    </pre>
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Tips:</h3>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Use quotes around text that contains commas</li>
                    <li>Make sure the first row contains the column headers</li>
                    <li>Each row represents one flashcard</li>
                    <li>The file must be in CSV (Comma Separated Values) format</li>
                  </ul>
                </div>
                
                <Button onClick={downloadTemplate} variant="outline" className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Download CSV Template
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ImportCSV;
