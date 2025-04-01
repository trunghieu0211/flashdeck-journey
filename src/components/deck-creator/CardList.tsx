
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2, MoveVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useToast } from "@/hooks/use-toast";
import { UseFieldArrayReturn } from "react-hook-form";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface CardListProps {
  fields: any[];
  currentCardIndex: number;
  setCurrentCardIndex: (index: number) => void;
  remove: UseFieldArrayReturn["remove"];
  handleAddCard: () => void;
  handleDragEnd: (result: any) => void;
}

const CardList: React.FC<CardListProps> = ({
  fields,
  currentCardIndex,
  setCurrentCardIndex,
  remove,
  handleAddCard,
  handleDragEnd,
}) => {
  const { toast } = useToast();
  const [dragEnabled, setDragEnabled] = useState(true);
  
  // Count completed cards (both front and back filled)
  const completedCards = fields.filter(card => 
    card.front?.trim() && card.back?.trim()
  ).length;
  
  const progressPercentage = fields.length > 0 
    ? Math.round((completedCards / fields.length) * 100) 
    : 0;

  return (
    <div className="md:col-span-1 border rounded-md flex flex-col max-h-[calc(100vh-250px)]">
      <div className="p-3 border-b">
        <h3 className="font-medium text-sm mb-2">Cards List</h3>
        <div className="flex items-center gap-2 mb-2">
          <Progress value={progressPercentage} className="h-2 flex-1" />
          <span className="text-xs text-muted-foreground">{completedCards}/{fields.length}</span>
        </div>
        <div className="flex justify-between items-center">
          <Badge variant="outline" className="text-xs">
            {completedCards === fields.length ? "All complete" : `${fields.length - completedCards} incomplete`}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 text-xs"
            onClick={() => setDragEnabled(!dragEnabled)}
          >
            <MoveVertical className="h-3 w-3 mr-1" />
            {dragEnabled ? "Lock order" : "Enable reordering"}
          </Button>
        </div>
      </div>
      
      <div className="overflow-y-auto flex-1">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="cards-list" isDropDisabled={!dragEnabled}>
            {(provided) => (
              <ul
                className="space-y-1 p-2"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {fields.map((item, index) => (
                  <Draggable 
                    key={item.id} 
                    draggableId={item.id} 
                    index={index}
                    isDragDisabled={!dragEnabled}
                  >
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={`p-2 text-sm border rounded cursor-pointer ${
                          snapshot.isDragging ? "opacity-70" : ""
                        } ${
                          currentCardIndex === index ? "bg-primary text-white" : "hover:bg-muted"
                        } ${
                          !item.front || !item.back ? "border-dashed" : ""
                        }`}
                        onClick={() => setCurrentCardIndex(index)}
                      >
                        <div className="flex justify-between items-center">
                          <div className="truncate flex-1">
                            <span className="font-medium mr-1">{index + 1}.</span> 
                            {item.front ? 
                              <span className="truncate">{item.front}</span> : 
                              <span className="italic text-muted-foreground">(Empty)</span>
                            }
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className={`h-6 w-6 ${currentCardIndex === index ? "text-white" : "text-muted-foreground"}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              if (fields.length > 1) {
                                remove(index);
                                if (currentCardIndex >= index && currentCardIndex > 0) {
                                  setCurrentCardIndex(currentCardIndex - 1);
                                }
                              } else {
                                toast({
                                  title: "Cannot remove all cards",
                                  description: "You must have at least one card in your deck.",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </ul>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      
      <div className="p-2 border-t mt-auto">
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed"
          onClick={handleAddCard}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Card
        </Button>
      </div>
    </div>
  );
};

export default CardList;
