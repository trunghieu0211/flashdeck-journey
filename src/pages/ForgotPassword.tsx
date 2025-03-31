
import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/AuthLayout";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      // Here we would normally connect to Supabase or another backend service
      console.log("Reset password for:", values.email);
      
      // Show success toast
      toast({
        title: "Password reset email sent",
        description: "Please check your email for password reset instructions.",
      });
      
      // Update UI state to show success message
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: "Failed to send reset email",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset your password</CardTitle>
          <CardDescription className="text-center">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="p-3 bg-muted rounded-full inline-block mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6">
                  <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-4.5"></path>
                  <path d="m22 10.5-9 4.55a2 2 0 0 1-2 0L2 10.5"></path>
                  <path d="M18 2 12 7 6 2"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium">Check your email</h3>
              <p className="text-sm text-muted-foreground">
                We've sent a password reset link to your email address.
              </p>
              <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                Back to login
              </Button>
              <p className="text-xs text-muted-foreground">
                Didn't receive an email?{" "}
                <button 
                  type="button" 
                  className="underline underline-offset-4 hover:text-primary"
                  onClick={() => setIsSubmitted(false)}
                >
                  Try again
                </button>
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="example@email.com"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Send reset link
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link 
            to="/login" 
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            Back to login
          </Link>
        </CardFooter>
      </Card>
    </AuthLayout>
  );
};

export default ForgotPassword;
