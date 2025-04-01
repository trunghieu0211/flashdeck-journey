
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Bold, Italic, Underline, Image, Mic } from "lucide-react";

const formSchema = z.object({
  front: z.string().min(1, {
    message: "Front content is required",
  }),
  back: z.string().min(1, {
    message: "Back content is required",
  }),
  example: z.string().optional(),
  notes: z.string().optional(),
});

interface CardFormProps {
  onSubmit: (values: z.infer<typeof formSchema>) => void;
  defaultValues?: z.infer<typeof formSchema>;
}

const CardForm: React.FC<CardFormProps> = ({ onSubmit, defaultValues }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      front: "",
      back: "",
      example: "",
      notes: "",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Front Side */}
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="front"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel className="text-base font-medium">Front Side</FormLabel>
                    <div className="flex space-x-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Bold className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Italic className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Underline className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter front side content..." 
                      className="min-h-[120px] resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button type="button" size="sm" variant="outline" className="h-7 text-xs">
                      <Image className="h-3.5 w-3.5 mr-1" />
                      Add Image
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="h-7 text-xs">
                      <Mic className="h-3.5 w-3.5 mr-1" />
                      Record Audio
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          {/* Back Side */}
          <div className="space-y-3">
            <FormField
              control={form.control}
              name="back"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center mb-2">
                    <FormLabel className="text-base font-medium">Back Side</FormLabel>
                    <div className="flex space-x-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Bold className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Italic className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-7 w-7">
                        <Underline className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter back side content..." 
                      className="min-h-[120px] resize-none"
                      {...field} 
                    />
                  </FormControl>
                  <div className="flex justify-end space-x-2 mt-2">
                    <Button type="button" size="sm" variant="outline" className="h-7 text-xs">
                      <Image className="h-3.5 w-3.5 mr-1" />
                      Add Image
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="h-7 text-xs">
                      <Mic className="h-3.5 w-3.5 mr-1" />
                      Record Audio
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <FormField
          control={form.control}
          name="example"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Example (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter an example..." {...field} />
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
              <FormLabel>Notes (optional)</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Add notes, memory tips..." 
                  rows={2}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Save Card
        </Button>
      </form>
    </Form>
  );
};

export default CardForm;
