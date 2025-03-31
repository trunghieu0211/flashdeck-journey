
import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import AuthLayout from "@/components/AuthLayout";

const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const email = location.state?.email || "your email";
  
  const resendVerification = () => {
    // Here we would normally connect to Supabase or another backend service
    toast({
      title: "Verification email sent",
      description: "Please check your inbox for the verification link.",
    });
  };

  return (
    <AuthLayout>
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Verify your email</CardTitle>
          <CardDescription className="text-center">
            We've sent a verification link to {email}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="p-3 bg-muted rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary h-6 w-6">
                <path d="M22 10.5V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h16a2 2 0 0 0 2-2v-4.5"></path>
                <path d="m22 10.5-9 4.55a2 2 0 0 1-2 0L2 10.5"></path>
                <path d="M18 2 12 7 6 2"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-lg">Check your email</h3>
              <p className="text-muted-foreground mt-1">
                Please check your email inbox and click on the verification link to verify your account.
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the email?
            </p>
            <Button 
              variant="outline" 
              onClick={resendVerification}
              className="w-full"
            >
              Resend verification email
            </Button>
          </div>
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

export default VerifyEmail;
