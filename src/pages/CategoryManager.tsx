
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Layout from "@/components/Layout";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Pencil, Plus, Trash } from "lucide-react";

// Mock category data
const initialCategories = [
  { id: "languages", name: "Languages", deckCount: 5 },
  { id: "science", name: "Science", deckCount: 3 },
  { id: "math", name: "Mathematics", deckCount: 2 },
  { id: "history", name: "History", deckCount: 0 },
  { id: "tech", name: "Technology", deckCount: 7 },
  { id: "arts", name: "Arts", deckCount: 1 },
];

interface Category {
  id: string;
  name: string;
  deckCount: number;
}

const CategoryManager: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Category name required",
        description: "Please enter a name for the new category.",
        variant: "destructive",
      });
      return;
    }
    
    const newId = newCategoryName.toLowerCase().replace(/\s+/g, "-");
    
    if (categories.some(cat => cat.id === newId)) {
      toast({
        title: "Category already exists",
        description: "A category with this name already exists.",
        variant: "destructive",
      });
      return;
    }
    
    const newCategory: Category = {
      id: newId,
      name: newCategoryName,
      deckCount: 0,
    };
    
    setCategories([...categories, newCategory]);
    setNewCategoryName("");
    
    toast({
      title: "Category created",
      description: `"${newCategoryName}" category has been created.`,
    });
  };
  
  const handleUpdateCategory = () => {
    if (!editingCategory || !editingCategory.name.trim()) {
      toast({
        title: "Category name required",
        description: "Please enter a name for the category.",
        variant: "destructive",
      });
      return;
    }
    
    setCategories(
      categories.map(cat => 
        cat.id === editingCategory.id ? editingCategory : cat
      )
    );
    
    setEditingCategory(null);
    
    toast({
      title: "Category updated",
      description: `"${editingCategory.name}" category has been updated.`,
    });
  };
  
  const handleDeleteCategory = (id: string) => {
    const categoryToDelete = categories.find(cat => cat.id === id);
    
    if (categoryToDelete?.deckCount && categoryToDelete.deckCount > 0) {
      toast({
        title: "Cannot delete category",
        description: `This category contains ${categoryToDelete.deckCount} decks. Please reassign or delete them first.`,
        variant: "destructive",
      });
      return;
    }
    
    setCategories(categories.filter(cat => cat.id !== id));
    
    toast({
      title: "Category deleted",
      description: `Category has been deleted successfully.`,
    });
  };

  return (
    <Layout>
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Category Manager</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> New Category
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Category</DialogTitle>
                <DialogDescription>
                  Add a new category to organize your flashcard decks.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Enter category name"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setNewCategoryName("")}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCategory}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground">No categories yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-center">Decks</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-center">{category.deckCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingCategory(category)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit Category</DialogTitle>
                                <DialogDescription>
                                  Update the category name.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="py-4">
                                <Input
                                  value={editingCategory?.name || ""}
                                  onChange={(e) => 
                                    setEditingCategory(
                                      prev => prev ? {...prev, name: e.target.value} : null
                                    )
                                  }
                                  placeholder="Enter category name"
                                />
                              </div>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setEditingCategory(null)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleUpdateCategory}>Save</Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Category</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the "{category.name}" category? 
                                  {category.deckCount > 0 && (
                                    <span className="font-medium text-destructive block mt-2">
                                      This category contains {category.deckCount} decks. 
                                      You must reassign or delete them first.
                                    </span>
                                  )}
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className={category.deckCount > 0 ? "pointer-events-none opacity-50" : ""}
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CategoryManager;
