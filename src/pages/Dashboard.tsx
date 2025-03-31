
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import DeckCard, { DeckProps } from "@/components/DeckCard";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // Mock data for demonstration
  const [decks] = useState<DeckProps[]>([
    {
      id: "1",
      title: "Spanish Vocabulary",
      description: "Essential Spanish words and phrases for beginners",
      cardCount: 50,
      progress: 25,
      category: "Languages",
      lastStudied: "Today",
    },
    {
      id: "2",
      title: "JavaScript Fundamentals",
      description: "Core concepts of JavaScript programming language",
      cardCount: 30,
      progress: 70,
      category: "Technology",
      color: "bg-secondary",
      lastStudied: "Yesterday",
    },
    {
      id: "3",
      title: "World Capitals",
      description: "Capitals of countries around the world",
      cardCount: 195,
      progress: 10,
      category: "Geography",
      color: "bg-green-500",
      lastStudied: "3 days ago",
    },
  ]);

  const handleDeckClick = (id: string) => {
    navigate(`/study/${id}`);
  };

  const createNewDeck = () => {
    navigate("/create");
  };

  return (
    <Layout>
      <div className="container max-w-md mx-auto px-4 py-6 pb-20">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Decks</h1>
          <Button onClick={createNewDeck} size="sm">
            <PlusCircle className="mr-2 h-4 w-4" /> New Deck
          </Button>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            {decks.length > 0 ? (
              <div className="grid gap-4">
                {decks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    {...deck}
                    onClick={() => handleDeckClick(deck.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No decks yet</p>
                <Button onClick={createNewDeck}>Create Your First Deck</Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="recent">
            <div className="grid gap-4">
              {decks
                .filter((deck) => deck.lastStudied === "Today" || deck.lastStudied === "Yesterday")
                .map((deck) => (
                  <DeckCard
                    key={deck.id}
                    {...deck}
                    onClick={() => handleDeckClick(deck.id)}
                  />
                ))}
            </div>
          </TabsContent>
          <TabsContent value="favorites">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No favorite decks yet</p>
            </div>
          </TabsContent>
        </Tabs>

        <div className="bg-muted/50 rounded-lg p-4 mb-6">
          <h2 className="font-medium mb-2">Study Progress</h2>
          <div className="progress-bar mb-2">
            <div className="progress-bar-fill" style={{ width: "35%" }}></div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Daily goal: 35%</span>
            <span>7/20 cards</span>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
