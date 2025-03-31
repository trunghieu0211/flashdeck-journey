
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface DeckProps {
  id: string;
  title: string;
  description: string;
  cardCount: number;
  progress: number;
  category: string;
  color?: string;
  lastStudied?: string;
  onClick?: () => void;
}

const DeckCard: React.FC<DeckProps> = ({
  id,
  title,
  description,
  cardCount,
  progress,
  category,
  color = "bg-primary",
  lastStudied,
  onClick,
}) => {
  return (
    <Card
      className="card-3d overflow-hidden cursor-pointer h-full"
      onClick={onClick}
    >
      <div className={cn("h-2", color)} />
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
            <p className="text-muted-foreground text-sm line-clamp-2 mb-2">
              {description}
            </p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {cardCount} {cardCount === 1 ? "card" : "cards"}
          </span>
        </div>

        {progress > 0 && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mb-2">
            <div
              className="bg-primary h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {lastStudied && lastStudied !== "Never" && (
          <p className="text-xs text-muted-foreground mt-3">
            Last studied: {lastStudied}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default DeckCard;
