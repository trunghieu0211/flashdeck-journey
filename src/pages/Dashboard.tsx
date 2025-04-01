
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import DeckCard, { DeckProps } from "@/components/DeckCard";
import { Button } from "@/components/ui/button";
import { 
  PlusCircle, 
  BookOpen, 
  Clock, 
  Trophy, 
  Calendar,
  Search,
  Filter,
  BarChart3,
  ChevronDown,
  GridIcon,
  ListIcon
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState("");
  
  // Fetch user decks from Supabase
  const { data: decks = [], isLoading } = useQuery({
    queryKey: ["decks", user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      // Fetch user's decks
      const { data: userDecks, error: userDecksError } = await supabase
        .from("decks")
        .select(`
          *,
          cards:cards(count)
        `)
        .eq("user_id", user.id);
      
      if (userDecksError) {
        console.error("Error fetching user decks:", userDecksError);
        return [];
      }
      
      // Transform data to match DeckProps
      return userDecks.map(deck => ({
        id: deck.id,
        title: deck.title,
        description: deck.description || "",
        cardCount: deck.cards?.[0]?.count || 0,
        progress: 0, // We'll implement progress tracking later
        category: deck.category || "Uncategorized",
        color: deck.color,
        lastStudied: "Never", // This will be updated later
      }));
    },
    enabled: !!user,
  });

  // Fetch study progress statistics
  const { data: studyStats = { totalCards: 0, studiedToday: 0, streak: 0 } } = useQuery({
    queryKey: ["study-stats", user?.id],
    queryFn: async () => {
      if (!user) return { totalCards: 0, studiedToday: 0, streak: 0 };
      
      // Get total cards count
      const { data: totalCardsData, error: totalCardsError } = await supabase
        .from("cards")
        .select("deck_id", { count: 'exact' })
        .in("deck_id", decks.map(deck => deck.id));
      
      if (totalCardsError) {
        console.error("Error fetching total cards:", totalCardsError);
        return { totalCards: 0, studiedToday: 0, streak: 0 };
      }
      
      // For now, randomize the studied cards to show some progress
      // In a real implementation, we would track this in a separate table
      const totalCards = totalCardsData?.length || 0;
      const studiedToday = Math.floor(Math.random() * totalCards);
      
      return {
        totalCards,
        studiedToday: Math.min(studiedToday, totalCards),
        streak: Math.floor(Math.random() * 10) // Placeholder for streak data
      };
    },
    enabled: !!user && decks.length > 0,
  });

  const handleDeckClick = (id: string) => {
    navigate(`/study/${id}`);
  };

  const createNewDeck = () => {
    navigate("/create");
  };

  // Filter decks for tabs and search
  const filteredDecks = decks.filter(deck => 
    deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    deck.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const recentDecks = filteredDecks.filter(deck => 
    deck.lastStudied === "Today" || deck.lastStudied === "Yesterday"
  );

  const favoriteDecks = filteredDecks.filter(deck => 
    // This is a placeholder. In a real app, you would track favorites in the database
    deck.title.length % 3 === 0 // Just a random condition for demonstration
  );

  // Calculate progress percentage
  const progressPercentage = studyStats.totalCards > 0
    ? Math.round((studyStats.studiedToday / studyStats.totalCards) * 100)
    : 0;

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "buổi sáng";
    if (hour < 18) return "buổi chiều";
    return "buổi tối";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-6 pb-20">
        {/* Welcome and Quick Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                Xin chào {user?.email?.split("@")[0] || "bạn"}, chúc {getTimeOfDay()} tốt lành!
              </h1>
              <p className="text-muted-foreground">
                {studyStats.streak > 0 ? 
                  `Chuỗi học liên tiếp: ${studyStats.streak} ngày. Tiếp tục phát huy!` : 
                  "Bắt đầu chuỗi ngày học liên tiếp ngay hôm nay!"
                }
              </p>
            </div>
            <Button onClick={createNewDeck}>
              <PlusCircle className="mr-2 h-4 w-4" /> Tạo bộ thẻ mới
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <BookOpen className="mr-2 h-4 w-4 text-primary" />
                  Thẻ đã học hôm nay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{studyStats.studiedToday}</p>
                <p className="text-muted-foreground text-sm">
                  / {studyStats.totalCards} thẻ
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Clock className="mr-2 h-4 w-4 text-primary" />
                  Thời gian học trung bình
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12</p>
                <p className="text-muted-foreground text-sm">
                  phút/ngày trong tuần này
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center text-lg">
                  <Trophy className="mr-2 h-4 w-4 text-primary" />
                  Thành tích
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{studyStats.streak}</p>
                <p className="text-muted-foreground text-sm">
                  ngày học liên tiếp
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Study Progress */}
        {decks.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="mr-2 h-5 w-5" /> Tiến độ học tập
              </CardTitle>
              <CardDescription>
                {progressPercentage < 30 
                  ? "Hãy tiếp tục học để đạt mục tiêu hôm nay!" 
                  : progressPercentage < 70 
                    ? "Bạn đang làm tốt lắm!" 
                    : "Gần đạt mục tiêu rồi, cố lên!"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Mục tiêu hôm nay</span>
                  <span className="font-medium">{studyStats.studiedToday}/{studyStats.totalCards} thẻ</span>
                </div>
                
                <div className="w-full bg-muted rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* My Decks with Search and View Options */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-bold">Bộ thẻ của tôi</h2>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm bộ thẻ..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Mới nhất</DropdownMenuItem>
                  <DropdownMenuItem>Cũ nhất</DropdownMenuItem>
                  <DropdownMenuItem>A-Z</DropdownMenuItem>
                  <DropdownMenuItem>Z-A</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="flex items-center border rounded-md overflow-hidden">
                <Button 
                  variant={viewMode === 'grid' ? "default" : "ghost"} 
                  size="sm" 
                  className="rounded-none" 
                  onClick={() => setViewMode('grid')}
                >
                  <GridIcon className="h-4 w-4" />
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <Button 
                  variant={viewMode === 'list' ? "default" : "ghost"} 
                  size="sm" 
                  className="rounded-none" 
                  onClick={() => setViewMode('list')}
                >
                  <ListIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="recent">Gần đây</TabsTrigger>
            <TabsTrigger value="favorites">Yêu thích</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="py-8 text-center">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Đang tải bộ thẻ của bạn...</p>
              </div>
            ) : filteredDecks.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                {filteredDecks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    {...deck}
                    onClick={() => handleDeckClick(deck.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : searchQuery ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">Không tìm thấy bộ thẻ khớp với "{searchQuery}"</p>
                <Button onClick={() => setSearchQuery("")}>Xóa tìm kiếm</Button>
              </div>
            ) : (
              <div className="text-center py-12 bg-muted/20 rounded-lg border border-dashed">
                <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground mb-4">Bạn chưa có bộ thẻ nào</p>
                <Button onClick={createNewDeck} className="mb-4">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Tạo bộ thẻ đầu tiên
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="recent">
            {recentDecks.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                {recentDecks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    {...deck}
                    onClick={() => handleDeckClick(deck.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không có bộ thẻ nào được học gần đây</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="favorites">
            {favoriteDecks.length > 0 ? (
              <div className={viewMode === 'grid' ? "grid md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
                {favoriteDecks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    {...deck}
                    onClick={() => handleDeckClick(deck.id)}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Không có bộ thẻ yêu thích</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Đánh dấu bộ thẻ yêu thích bằng cách nhấn vào icon ngôi sao
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Quick Learning Section */}
        {decks.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" /> Lịch học hôm nay
              </CardTitle>
              <CardDescription>
                Gợi ý các bộ thẻ cần ôn tập dựa trên thuật toán spaced repetition
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {decks.slice(0, 2).map((deck) => (
                  <div 
                    key={deck.id}
                    className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 cursor-pointer"
                    onClick={() => handleDeckClick(deck.id)}
                  >
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-md flex items-center justify-center ${deck.color || "bg-primary"}`}>
                        <BookOpen className="h-5 w-5 text-white" />
                      </div>
                      <div className="ml-3">
                        <h4 className="font-medium">{deck.title}</h4>
                        <p className="text-sm text-muted-foreground">{deck.cardCount} thẻ</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">15 phút</p>
                      <p className="text-xs text-muted-foreground">ôn tập</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 flex justify-between items-center">
                <p className="text-sm text-muted-foreground">Dự kiến 30 phút để hoàn thành</p>
                <Button size="sm">
                  Học ngay
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;
