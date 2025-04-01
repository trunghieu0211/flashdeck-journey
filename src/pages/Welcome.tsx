
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { BarChart, CheckCircle, MousePointerClick, Sparkles, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-12 w-12 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If user is already logged in, redirect to dashboard
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Welcome back!</h1>
          <p className="mb-6">You're already signed in.</p>
          <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      {/* Hero Section with Animation */}
      <div className="relative flex-1 flex flex-col md:flex-row justify-between items-center px-4 py-16 md:py-24 max-w-7xl mx-auto w-full">
        <div className="md:w-1/2 text-left space-y-6 z-10">
          <motion.h1 
            className="text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Học nhanh hơn <span className="text-primary">80%</span> với phương pháp flashcard thông minh
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Tối ưu hóa việc học với thuật toán spaced repetition - giúp nhớ lâu, học hiệu quả và tiết kiệm thời gian.
          </motion.p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 pt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              asChild
              className="text-lg px-8 py-6 transition-transform hover:scale-105"
            >
              <Link to="/signup">Bắt đầu miễn phí</Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              asChild
              className="text-lg"
            >
              <Link to="/dashboard">Dùng thử không cần tài khoản</Link>
            </Button>
          </motion.div>
        </div>

        {/* Interactive flashcard demo */}
        <motion.div 
          className="md:w-1/2 mt-12 md:mt-0 perspective-1000"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative w-full max-w-md mx-auto md:mx-0">
            {/* Front card */}
            <div className="bg-card border-2 border-primary/20 p-8 rounded-xl shadow-lg transform rotate-6 hover:rotate-0 transition-all duration-500">
              <h3 className="text-2xl font-semibold mb-2">Spaced Repetition</h3>
              <p className="text-muted-foreground">Nhắc lại đúng thời điểm trước khi bạn quên</p>
            </div>
            
            {/* Back card */}
            <div className="absolute inset-0 bg-card border-2 border-secondary/20 p-8 rounded-xl shadow-lg transform -rotate-3 hover:rotate-0 transition-all duration-500">
              <h3 className="text-2xl font-semibold mb-2">Active Recall</h3>
              <p className="text-muted-foreground">Học chủ động qua việc tự kiểm tra kiến thức</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/40 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Tính năng nổi bật</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Trải nghiệm cách học hiệu quả nhất với công nghệ hiện đại và thiết kế thông minh
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Clock className="h-10 w-10 text-primary" />}
              title="Thuật toán thông minh"
              description="Học đúng thời điểm với spaced repetition, tiết kiệm thời gian và ghi nhớ lâu hơn."
            />
            <FeatureCard
              icon={<Sparkles className="h-10 w-10 text-primary" />}
              title="Đa dạng nội dung"
              description="Hỗ trợ văn bản, hình ảnh, âm thanh và video để học mọi chủ đề một cách hiệu quả."
            />
            <FeatureCard
              icon={<Globe className="h-10 w-10 text-primary" />}
              title="Học mọi lúc, mọi nơi"
              description="Đồng bộ trên mọi thiết bị, học offline và online với trải nghiệm liền mạch."
            />
          </div>
          
          {/* Stats Section */}
          <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem value="2M+" label="Người dùng" />
            <StatItem value="100M+" label="Thẻ đã học" />
            <StatItem value="85%" label="Tỷ lệ ghi nhớ" />
            <StatItem value="200+" label="Chủ đề" />
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Learning curve chart */}
            <div className="md:w-1/2">
              <motion.div 
                className="bg-muted/30 p-6 rounded-xl border"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <h3 className="text-xl font-semibold mb-4">Hiệu quả học tập theo thời gian</h3>
                <div className="h-64 relative">
                  {/* Traditional learning curve - declining */}
                  <div className="absolute bottom-0 left-0 w-full h-full flex items-end">
                    <div className="w-full bg-muted/50 h-px absolute bottom-0"></div>
                    <div className="w-px bg-muted/50 h-full absolute left-0"></div>
                    
                    {/* Traditional curve */}
                    <div className="relative w-full h-full">
                      <div className="absolute bottom-0 left-0 w-full h-40 overflow-hidden">
                        <div 
                          className="w-full h-40 border-t-2 border-red-400/70 bg-gradient-to-b from-red-400/20 to-transparent"
                          style={{
                            clipPath: "polygon(0 0, 100% 100%, 100% 100%, 0% 100%)",
                          }}
                        ></div>
                      </div>
                      <div className="absolute bottom-0 right-4 text-sm text-red-500">Học truyền thống</div>
                    </div>
                    
                    {/* Spaced repetition curve */}
                    <div className="relative w-full h-full">
                      <div className="absolute bottom-0 left-0 w-full h-64 overflow-hidden">
                        <div 
                          className="w-full h-64 border-t-2 border-primary bg-gradient-to-b from-primary/20 to-transparent"
                          style={{
                            clipPath: "polygon(0 80%, 20% 60%, 40% 70%, 60% 30%, 80% 20%, 100% 10%, 100% 100%, 0 100%)",
                          }}
                        ></div>
                      </div>
                      <div className="absolute bottom-24 right-4 text-sm text-primary">FlashDeck</div>
                    </div>
                    
                    {/* X-axis labels */}
                    <div className="absolute bottom-[-25px] left-0 w-full flex justify-between text-xs text-muted-foreground">
                      <span>1 ngày</span>
                      <span>1 tuần</span>
                      <span>1 tháng</span>
                      <span>6 tháng</span>
                    </div>
                    
                    <div className="absolute -left-[30px] top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
                      <span>100%</span>
                      <span>75%</span>
                      <span>50%</span>
                      <span>25%</span>
                      <span>0%</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <div className="md:w-1/2 space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <CheckCircle className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Hiệu quả tức thì</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Người dùng ghi nhớ được 80% thông tin sau khi học chỉ với 20% thời gian so với phương pháp truyền thống.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <BarChart className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Phân tích dữ liệu học tập</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Thuật toán tự động phân tích điểm mạnh, điểm yếu và điều chỉnh lịch học phù hợp với từng cá nhân.
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MousePointerClick className="text-primary h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">Dễ dàng sử dụng</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Giao diện trực quan, thân thiện với người dùng, giúp việc học trở nên đơn giản và thú vị hơn.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 py-16 px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Sẵn sàng cải thiện cách học của bạn?</h2>
          <p className="text-xl text-muted-foreground">
            Tham gia cùng hàng triệu người dùng đã cải thiện hiệu quả học tập của họ với FlashDeck.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8">
              <Link to="/signup">Tạo tài khoản miễn phí</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg">
              <Link to="/login">Đã có tài khoản? Đăng nhập</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="py-8 px-4 bg-background">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-lg font-semibold">FlashDeck</p>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} FlashDeck. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Helper components
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground">{description}</p>
  </div>
);

const StatItem = ({ value, label }) => (
  <div>
    <p className="text-4xl font-bold text-primary">{value}</p>
    <p className="text-muted-foreground">{label}</p>
  </div>
);

export default Welcome;
