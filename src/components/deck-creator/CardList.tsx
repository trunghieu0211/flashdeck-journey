
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useToast } from "@/hooks/use-toast";
import { UseFieldArrayReturn } from "react-hook-form";

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

  return (
    <div className="md:col-span-1 overflow-y-auto max-h-96 border rounded-md">
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="cards-list">
          {(provided) => (
            <ul
              className="space-y-1 p-2"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {fields.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`p-2 text-sm border rounded cursor-pointer ${
                        currentCardIndex === index ? "bg-primary text-white" : "hover:bg-muted"
                      }`}
                      onClick={() => setCurrentCardIndex(index)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">
                          {index + 1}. {item.front || "(Empty)"}
                        </span>
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
      <Button
        type="button"
        variant="outline"
        className="w-full mt-2 border-dashed"
        onClick={handleAddCard}
      >
        <PlusCircle className="h-4 w-4 mr-2" />
        Add Card
      </Button>
    </div>
  );
};

export default CardList;
