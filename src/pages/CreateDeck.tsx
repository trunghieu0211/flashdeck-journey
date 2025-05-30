
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Plus, Eye, FileUp, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title needs at least 2 characters" }),
  description: z.string().min(5, { message: "Description needs at least 5 characters" }),
  category: z.string().min(1, { message: "Please select a category" }),
  color: z.string().default("bg-primary"),
  isPublic: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

const colorOptions = [
  { value: "bg-primary", label: "Blue", className: "bg-primary" },
  { value: "bg-secondary", label: "Purple", className: "bg-secondary" },
  { value: "bg-green-500", label: "Green", className: "bg-green-500" },
  { value: "bg-red-500", label: "Red", className: "bg-red-500" },
  { value: "bg-yellow-500", label: "Yellow", className: "bg-yellow-500" },
  { value: "bg-orange-500", label: "Orange", className: "bg-orange-500" },
  { value: "bg-pink-500", label: "Pink", className: "bg-pink-500" },
];

const CreateDeck: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [csvContent, setCsvContent] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // Fetch categories from Supabase
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name");
      
      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
      return data || [];
    }
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      color: "bg-primary",
      isPublic: false,
    },
  });

  const selectedColor = form.watch("color");

  const handleSubmit = async (values: FormValues) => {
    setIsSaving(true);
    console.log("Creating deck:", values);
    
    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to save your deck.",
          variant: "destructive",
        });
        setIsSaving(false);
        navigate("/login");
        return;
      }
      
      // Insert deck into Supabase
      const { data, error } = await supabase
        .from("decks")
        .insert({
          title: values.title,
          description: values.description,
          category: values.category,
          color: values.color,
          is_public: values.isPublic,
          user_id: user.id
        })
        .select()
        .single();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Success!",
        description: "Your new deck has been created.",
      });
      
      navigate(`/edit/deck/${data.id}`);
    } catch (error) {
      console.error("Error creating deck:", error);
      toast({
        title: "Failed to save deck",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCsvContent(event.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleCsvImport = async () => {
    if (!csvContent) {
      toast({
        title: "No data to import",
        description: "Please upload a CSV file first.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Parse CSV content (simple implementation)
      const lines = csvContent.split('\n');
      if (lines.length < 2) {
        throw new Error("CSV file must contain at least a header row and one data row");
      }

      // Extract headers and validate format
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredHeaders = ['title', 'description', 'category'];
      const missingHeaders = requiredHeaders.filter(h => !headers.includes(h));
      
      if (missingHeaders.length > 0) {
        throw new Error(`CSV is missing required headers: ${missingHeaders.join(', ')}`);
      }
      
      // Get the first data row
      const firstDataRow = lines[1].split(',').map(cell => cell.trim());
      const deckData: Record<string, string> = {};
      
      headers.forEach((header, index) => {
        if (index < firstDataRow.length) {
          deckData[header] = firstDataRow[index];
        }
      });
      
      // Populate form with data from the first row
      form.setValue('title', deckData.title || '');
      form.setValue('description', deckData.description || '');
      if (deckData.category) {
        form.setValue('category', deckData.category);
      }
      
      setImportDialogOpen(false);
      toast({
        title: "CSV imported",
        description: "Deck information has been loaded from the CSV file."
      });
      
    } catch (error) {
      console.error("CSV import error:", error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "Invalid CSV format",
        variant: "destructive"
      });
    }
  };

  const generateCsvTemplate = () => {
    const headers = "title,description,category,is_public";
    const example = "My Deck,Description of my deck,language-learning,true";
    const csvContent = `${headers}\n${example}`;
    
    // Create a download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'deck_template.csv');
    a.click();
    
    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sticky top-0 z-10 bg-background pb-4 border-b">
          <div className="flex items-center">
            <Button 
              onClick={() => navigate(-1)} 
              variant="ghost" 
              size="icon"
              className="mr-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Create New Deck</h1>
          </div>
          <Button 
            onClick={form.handleSubmit(handleSubmit)} 
            disabled={isSaving}
            className="relative"
          >
            {isSaving ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            )}
          </Button>
        </div>
        
        <Card className="mb-6 overflow-hidden shadow-lg border-t-4" style={{ borderTopColor: `var(--${selectedColor.replace('bg-', '')})` }}>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Title */}
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
                
                {/* Description */}
                <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                      <span>{isDescriptionOpen ? "Hide description" : "Add description"}</span>
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        width="16" 
                        height="16" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        className={`ml-2 transition-transform duration-200 ${isDescriptionOpen ? "rotate-180" : ""}`}
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="mt-3">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Textarea 
                              placeholder="Briefly describe what this deck is about..." 
                              className="min-h-[100px] resize-y"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CollapsibleContent>
                </Collapsible>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  
                  {/* Color */}
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Color</FormLabel>
                        <div className="flex flex-wrap gap-2">
                          {colorOptions.map((color) => (
                            <div 
                              key={color.value}
                              className={`w-8 h-8 rounded-full cursor-pointer transition-all hover:scale-110 ${
                                field.value === color.value ? "ring-2 ring-ring ring-offset-2" : ""
                              } ${color.className}`}
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

                {/* Visibility */}
                <FormField
                  control={form.control}
                  name="isPublic"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Public</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Allow others to view and copy this deck
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Tools */}
        <div className="flex justify-end mb-6">
          <div className="flex space-x-2">
            <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FileUp className="h-4 w-4 mr-2" />
                  Import CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Import Deck from CSV</DialogTitle>
                  <DialogDescription>
                    Upload a CSV file with deck information.
                    The CSV should have columns for title, description, and category.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center gap-4">
                    <Label htmlFor="csv-file" className="text-right">
                      CSV File
                    </Label>
                    <Input 
                      id="csv-file"
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                    />
                  </div>
                  <div>
                    <Button type="button" variant="outline" onClick={generateCsvTemplate} size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download Template
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setImportDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={handleCsvImport}>
                    Import
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" size="sm" onClick={() => navigate("/categories")}>
              <Plus className="h-4 w-4 mr-2" />
              Manage Categories
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </div>
        </div>

        {/* Cards section - Placeholder */}
        <Card className="p-6 text-center">
          <h3 className="text-xl font-medium mb-2">Flashcards</h3>
          <p className="text-muted-foreground mb-4">Save the deck first to start adding flashcards</p>
          <Button onClick={form.handleSubmit(handleSubmit)} className="mx-auto">
            <Save className="h-5 w-5 mr-2" />
            Save to add cards
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateDeck;
