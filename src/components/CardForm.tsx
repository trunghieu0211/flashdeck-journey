
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

const formSchema = z.object({
  front: z.string().min(1, {
    message: "Front content is required",
  }),
  back: z.string().min(1, {
    message: "Back content is required",
  }),
  example: z.string().optional(),
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
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="front"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Front</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter front content" {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="back"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Back</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter back content" {...field} rows={3} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="example"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Example (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Enter an example" {...field} />
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
