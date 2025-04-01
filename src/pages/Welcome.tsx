
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import OnboardingCard from "@/components/OnboardingCard";
import { SeedButton } from "@/utils/seedDb";
import { useAuth } from "@/hooks/useAuth";

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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 md:py-24">
        <div className="max-w-3xl w-full text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            FlashDeck
          </h1>
          <p className="text-xl text-muted-foreground">
            Create, study, and master any subject with our powerful flashcard system
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-muted/40 py-12 md:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Supercharge Your Learning
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <OnboardingCard
              title="Create Custom Decks"
              description="Build personalized flashcard decks for any subject or topic you want to learn."
              icon="layers"
            />
            <OnboardingCard
              title="Track Your Progress"
              description="Monitor your study sessions and see your improvement over time."
              icon="bar-chart"
            />
            <OnboardingCard
              title="Study Anywhere"
              description="Access your flashcards on any device, anytime, anywhere."
              icon="globe"
            />
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-semibold mb-4">Try Our Sample Decks</h3>
            <p className="mb-6 text-muted-foreground">
              Want to try out the app with pre-made content? Add some sample decks with one click.
            </p>
            {/* Pass an empty string when no user is logged in on the welcome page */}
            <SeedButton userId="" />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2023 FlashDeck. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms
            </Link>
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy
            </Link>
            <Link
              to="/"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Welcome;
