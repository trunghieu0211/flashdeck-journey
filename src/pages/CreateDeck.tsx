
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Import, Export, Plus, Eye } from "lucide-react";
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

const formSchema = z.object({
  title: z.string().min(2, { message: "Tiêu đề cần ít nhất 2 ký tự" }),
  description: z.string().min(5, { message: "Mô tả cần ít nhất 5 ký tự" }),
  category: z.string().min(1, { message: "Vui lòng chọn danh mục" }),
  color: z.string().default("bg-primary"),
  isPublic: z.boolean().default(false),
});

type FormValues = z.infer<typeof formSchema>;

// Mock categories
const categories = [
  { id: "languages", name: "Ngôn ngữ" },
  { id: "science", name: "Khoa học" },
  { id: "math", name: "Toán học" },
  { id: "history", name: "Lịch sử" },
  { id: "tech", name: "Công nghệ" },
  { id: "arts", name: "Nghệ thuật" },
];

const colorOptions = [
  { value: "bg-primary", label: "Xanh dương", className: "bg-primary" },
  { value: "bg-secondary", label: "Tím", className: "bg-secondary" },
  { value: "bg-green-500", label: "Xanh lá", className: "bg-green-500" },
  { value: "bg-red-500", label: "Đỏ", className: "bg-red-500" },
  { value: "bg-yellow-500", label: "Vàng", className: "bg-yellow-500" },
  { value: "bg-orange-500", label: "Cam", className: "bg-orange-500" },
  { value: "bg-pink-500", label: "Hồng", className: "bg-pink-500" },
];

const CreateDeck: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
    
    // Giả lập thời gian xử lý
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Thành công!",
      description: "Bộ thẻ mới đã được tạo.",
    });
    
    setIsSaving(false);
    navigate("/dashboard");
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
            <h1 className="text-2xl font-bold">Tạo bộ thẻ mới</h1>
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
                Đang lưu
              </span>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Lưu
              </>
            )}
          </Button>
        </div>
        
        <Card className="mb-6 overflow-hidden shadow-lg border-t-4" style={{ borderTopColor: `var(--${selectedColor.replace('bg-', '')})` }}>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                {/* Tiêu đề */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input 
                          placeholder="Nhập tiêu đề hấp dẫn cho bộ thẻ của bạn..." 
                          className="text-2xl font-bold border-0 border-b-2 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Mô tả */}
                <Collapsible open={isDescriptionOpen} onOpenChange={setIsDescriptionOpen}>
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                      <span>{isDescriptionOpen ? "Thu gọn mô tả" : "Thêm mô tả"}</span>
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
                              placeholder="Mô tả ngắn gọn về bộ thẻ này..." 
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
                  {/* Danh mục */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Danh mục</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn danh mục" />
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
                  
                  {/* Màu sắc */}
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Màu sắc</FormLabel>
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

                {/* Chế độ hiển thị */}
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
                        <FormLabel>Công khai</FormLabel>
                        <p className="text-sm text-muted-foreground">
                          Cho phép người khác xem và sao chép bộ thẻ này
                        </p>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Công cụ */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Button 
              variant={isAdvancedMode ? "default" : "outline"} 
              size="sm"
              onClick={() => setIsAdvancedMode(!isAdvancedMode)}
              className="mr-2"
            >
              {isAdvancedMode ? "Cơ bản" : "Nâng cao"}
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Import className="h-4 w-4 mr-2" />
              Nhập
            </Button>
            <Button variant="outline" size="sm">
              <Export className="h-4 w-4 mr-2" />
              Xuất
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Xem trước
            </Button>
          </div>
        </div>

        {/* Phần Card - Hiện tại chỉ hiển thị thông báo */}
        <Card className="p-6 text-center">
          <h3 className="text-xl font-medium mb-2">Thẻ học</h3>
          <p className="text-muted-foreground mb-4">Lưu bộ thẻ trước để bắt đầu thêm thẻ học</p>
          <Button variant="outline" className="mx-auto group" disabled>
            <Plus className="h-5 w-5 mr-2 group-hover:scale-125 transition-transform" />
            Thêm thẻ học mới
          </Button>
        </Card>
      </div>
    </Layout>
  );
};

export default CreateDeck;
