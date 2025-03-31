
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

// Sample data for decks and cards
const sampleDecks = [
  {
    title: "Từ vựng Tiếng Anh cơ bản",
    description: "Các từ vựng thông dụng trong giao tiếp hàng ngày (ví dụ: family, food, weather, travel).",
    category: "language-learning",
    color: "bg-blue-500",
    is_public: true,
    cards: [
      { front: "Mother", back: "Mẹ", example: "My mother is cooking dinner." },
      { front: "Father", back: "Cha", example: "My father works in an office." },
      { front: "Rain", back: "Mưa", example: "It's raining outside." },
      { front: "Hello", back: "Xin chào", example: "Hello, how are you?" },
      { front: "Food", back: "Thức ăn", example: "The food is delicious." },
    ]
  },
  {
    title: "Công thức Toán học",
    description: "Các công thức từ cơ bản (cộng, trừ) đến nâng cao (hình học, đại số, giải tích).",
    category: "mathematics",
    color: "bg-green-500",
    is_public: true,
    cards: [
      { front: "Chu vi hình tròn", back: "2πr", example: "r là bán kính" },
      { front: "Diện tích tam giác", back: "½bh", example: "b là đáy, h là chiều cao" },
      { front: "Định lý Pytago", back: "a² + b² = c²", example: "Trong tam giác vuông" },
      { front: "Công thức bậc hai", back: "x = (-b ± √(b² - 4ac))/2a", example: "Giải phương trình ax² + bx + c = 0" },
    ]
  },
  {
    title: "Sự kiện lịch sử thế giới",
    description: "Các mốc thời gian và sự kiện quan trọng trong lịch sử (chiến tranh, phát minh, nhân vật).",
    category: "history",
    color: "bg-red-500",
    is_public: true,
    cards: [
      { front: "1492", back: "Columbus phát hiện châu Mỹ", example: "Sự kiện đánh dấu kỷ nguyên khám phá mới" },
      { front: "1945", back: "Kết thúc Thế chiến II", example: "Với sự đầu hàng của Nhật Bản" },
      { front: "1969", back: "Con người đặt chân lên mặt trăng", example: "Neil Armstrong là người đầu tiên" },
      { front: "1989", back: "Bức tường Berlin sụp đổ", example: "Đánh dấu kết thúc Chiến tranh Lạnh" },
    ]
  },
  {
    title: "Kiến thức khoa học tự nhiên",
    description: "Các khái niệm về vật lý, hóa học, sinh học cơ bản.",
    category: "science",
    color: "bg-yellow-500",
    is_public: true,
    cards: [
      { front: "H2O", back: "Nước", example: "Công thức phân tử của nước" },
      { front: "F = ma", back: "Định luật II Newton", example: "Lực bằng khối lượng nhân gia tốc" },
      { front: "E = mc²", back: "Công thức năng lượng Einstein", example: "E là năng lượng, m là khối lượng, c là vận tốc ánh sáng" },
      { front: "CO2", back: "Carbon dioxide", example: "Khí thải gây hiệu ứng nhà kính" },
    ]
  },
  {
    title: "Ngữ pháp Tiếng Việt",
    description: "Quy tắc ngữ pháp, cấu trúc câu, cách dùng từ trong tiếng Việt.",
    category: "language-learning",
    color: "bg-purple-500",
    is_public: true,
    cards: [
      { front: "Chủ ngữ + Vị ngữ", back: "Cấu trúc câu cơ bản", example: "Tôi học." },
      { front: "Từ láy", back: "Từ mô phỏng âm thanh", example: "Lộp độp, long lanh, lấp lánh" },
      { front: "Trạng từ", back: "Từ bổ nghĩa cho động từ", example: "chạy nhanh, nói khẽ" },
      { front: "Danh từ", back: "Từ chỉ người, vật, hiện tượng", example: "con mèo, cái bàn, sự kiện" },
    ]
  },
];

const seedDatabase = async (userId: string) => {
  console.log("Starting database seeding...");
  
  // First, create categories if they don't exist
  const categories = [
    { id: "language-learning", name: "Language Learning" },
    { id: "mathematics", name: "Mathematics" },
    { id: "history", name: "History" },
    { id: "science", name: "Science" },
  ];
  
  for (const category of categories) {
    try {
      // Check if category exists
      const { data: existingCategory } = await supabase
        .from("categories")
        .select("*")
        .eq("id", category.id)
        .single();
        
      if (!existingCategory) {
        // Insert category if it doesn't exist
        await supabase.from("categories").insert(category);
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  }
  
  // Create decks and cards
  for (const deck of sampleDecks) {
    try {
      // Create deck
      const { data: deckData, error: deckError } = await supabase
        .from("decks")
        .insert({
          title: deck.title,
          description: deck.description,
          category: deck.category,
          color: deck.color,
          is_public: deck.is_public,
          user_id: userId
        })
        .select()
        .single();
      
      if (deckError) {
        console.error("Error inserting deck:", deckError);
        continue;
      }
      
      // Create cards for this deck
      if (deckData) {
        const cardsToInsert = deck.cards.map(card => ({
          deck_id: deckData.id,
          front: card.front,
          back: card.back,
          example: card.example
        }));
        
        const { error: cardsError } = await supabase
          .from("cards")
          .insert(cardsToInsert);
          
        if (cardsError) {
          console.error("Error inserting cards:", cardsError);
        }
      }
    } catch (error) {
      console.error("Error in seed process:", error);
    }
  }
  
  console.log("Database seeding completed!");
  return true;
};

// Seed button component
export const SeedButton = ({ userId }: { userId: string }) => {
  const { toast } = useToast();
  const [isSeeding, setIsSeeding] = useState(false);
  
  const handleSeed = async () => {
    setIsSeeding(true);
    try {
      await seedDatabase(userId);
      toast({
        title: "Sample data created!",
        description: "Sample decks and cards have been added to your account."
      });
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        title: "Error creating sample data",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsSeeding(false);
    }
  };
  
  return (
    <Button onClick={handleSeed} disabled={isSeeding}>
      {isSeeding ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating sample data...
        </>
      ) : (
        "Create sample decks"
      )}
    </Button>
  );
};

export default seedDatabase;
