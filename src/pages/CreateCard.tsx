
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Save, Image, Mic, Bold, Italic, Underline, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const formSchema = z.object({
  front: z.string().min(1, {
    message: "Mặt trước không được để trống",
  }),
  back: z.string().min(1, {
    message: "Mặt sau không được để trống",
  }),
  example: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const CreateCard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      front: "",
      back: "",
      example: "",
      notes: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSaving(true);
    console.log("Creating card:", values);
    
    // Giả lập thời gian xử lý
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Thành công!",
      description: "Thẻ mới đã được thêm vào bộ thẻ.",
    });
    
    setIsSaving(false);
    navigate("/dashboard");
  };

  const handlePreview = () => {
    setIsPreview(!isPreview);
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
            <h1 className="text-2xl font-bold">Thêm thẻ mới</h1>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={handlePreview}
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreview ? "Chỉnh sửa" : "Xem trước"}
            </Button>
            <Button 
              onClick={form.handleSubmit(handleSubmit)} 
              disabled={isSaving}
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
        </div>
        
        {isPreview ? (
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="w-full h-64 max-w-md perspective-1000">
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer hover:transform-rotate-y-180`}>
                <div className="absolute w-full h-full bg-white rounded-lg shadow-xl p-6 flex flex-col justify-center items-center backface-hidden">
                  <p className="text-xl font-medium">{form.getValues().front || "Mặt trước"}</p>
                  <p className="text-sm text-muted-foreground mt-4">Nhấp để lật thẻ</p>
                </div>
                <div className="absolute w-full h-full bg-white rounded-lg shadow-xl p-6 flex flex-col justify-center items-center backface-hidden transform-rotate-y-180">
                  <p className="text-xl">{form.getValues().back || "Mặt sau"}</p>
                  {form.getValues().example && (
                    <div className="mt-4 p-2 bg-muted rounded-md w-full">
                      <p className="text-sm"><strong>Ví dụ:</strong> {form.getValues().example}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <p className="text-muted-foreground text-sm">Nhấp vào thẻ để lật</p>
          </div>
        ) : (
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Mặt trước */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="front"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center mb-2">
                              <FormLabel className="text-lg font-medium">Mặt trước</FormLabel>
                              <div className="flex space-x-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Bold className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Italic className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Underline className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <FormControl>
                              <Textarea 
                                placeholder="Nhập nội dung mặt trước..." 
                                className="min-h-[150px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <div className="flex justify-end space-x-2 mt-2">
                              <Button type="button" size="sm" variant="outline" className="h-8">
                                <Image className="h-4 w-4 mr-1" />
                                Thêm ảnh
                              </Button>
                              <Button type="button" size="sm" variant="outline" className="h-8">
                                <Mic className="h-4 w-4 mr-1" />
                                Ghi âm
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Mặt sau */}
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="back"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex justify-between items-center mb-2">
                              <FormLabel className="text-lg font-medium">Mặt sau</FormLabel>
                              <div className="flex space-x-1">
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Bold className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Italic className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" className="h-8 w-8">
                                  <Underline className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <FormControl>
                              <Textarea 
                                placeholder="Nhập nội dung mặt sau..." 
                                className="min-h-[150px] resize-none"
                                {...field} 
                              />
                            </FormControl>
                            <div className="flex justify-end space-x-2 mt-2">
                              <Button type="button" size="sm" variant="outline" className="h-8">
                                <Image className="h-4 w-4 mr-1" />
                                Thêm ảnh
                              </Button>
                              <Button type="button" size="sm" variant="outline" className="h-8">
                                <Mic className="h-4 w-4 mr-1" />
                                Ghi âm
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <Separator />
                  
                  {/* Thông tin bổ sung */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Thông tin bổ sung</h3>
                    
                    <FormField
                      control={form.control}
                      name="example"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ví dụ (tùy chọn)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Nhập ví dụ để hiểu rõ hơn..." 
                              className="min-h-[80px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Ghi chú (tùy chọn)</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Thêm ghi chú, mẹo nhớ..." 
                              className="min-h-[80px] resize-none"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-end mt-6">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="mr-2"
          >
            Huỷ bỏ
          </Button>
          <Button onClick={form.handleSubmit(handleSubmit)} disabled={isSaving}>
            {isSaving ? "Đang lưu..." : "Lưu thẻ"}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCard;
