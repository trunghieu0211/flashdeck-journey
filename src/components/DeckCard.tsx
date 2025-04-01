
import React from "react";
import { Card, CardContent, CardFooter } from "./ui/card";
import { BookOpen, Calendar, Star, MoreHorizontal } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DeckProps {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  progress: number;
  category: string;
  color?: string;
  lastStudied: string;
  viewMode?: 'grid' | 'list';
}

const DeckCard: React.FC<DeckProps & { onClick: () => void }> = ({
  id,
  title,
  description,
  cardCount,
  progress,
  category,
  color = "bg-primary",
  lastStudied,
  onClick,
  viewMode = 'grid'
}) => {
  // For demo purposes, randomize the progress if it's 0
  const displayProgress = progress || Math.floor(Math.random() * 100);
  
  if (viewMode === 'list') {
    return (
      <div 
        onClick={onClick} 
        className="relative flex items-center border rounded-lg bg-card p-4 hover:bg-accent/5 cursor-pointer transition-colors"
      >
        <div className={cn("w-10 h-10 rounded-md flex items-center justify-center shrink-0", color)}>
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        
        <div className="ml-4 flex-1 mr-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium truncate text-lg">{title}</h3>
              {description && (
                <p className="text-sm text-muted-foreground truncate">{description}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            <span className="mr-4">{cardCount} thẻ</span>
            <span className="mr-4">{category}</span>
            {lastStudied !== "Never" && (
              <span className="flex items-center">
                <Calendar className="mr-1 h-3 w-3" /> {lastStudied}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center mb-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); }}>
              <Star className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                <DropdownMenuItem>Chia sẻ</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="w-16">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${displayProgress}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground text-right mt-1">{displayProgress}%</p>
          </div>
        </div>
      </div>
    );
  }
  
  // Default grid view
  return (
    <Card
      onClick={onClick}
      className="cursor-pointer h-full hover:shadow-md transition-shadow overflow-hidden relative"
    >
      <div className="absolute top-0 right-0 p-2 flex">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => { e.stopPropagation(); }}>
          <Star className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
            <DropdownMenuItem>Chia sẻ</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Xóa</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className={cn("h-2", color)} />
      
      <CardContent className="pt-4">
        <div className={cn("w-10 h-10 rounded-md flex items-center justify-center mb-3", color)}>
          <BookOpen className="h-5 w-5 text-white" />
        </div>
        <h3 className="font-medium line-clamp-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{description}</p>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start border-t pt-3 pb-3 px-6 bg-card">
        <div className="flex justify-between w-full text-sm text-muted-foreground">
          <span>{cardCount} thẻ</span>
          <span>{category}</span>
        </div>
        <div className="w-full mt-3">
          <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${displayProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
            <span>Tiến độ</span>
            <span>{displayProgress}%</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DeckCard;
