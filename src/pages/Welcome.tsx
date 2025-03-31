
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import OnboardingCard from "@/components/OnboardingCard";
import { Button } from "@/components/ui/button";

const Welcome: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  const onboardingSteps = [
    {
      title: "Welcome to FlashDeck",
      description: "Create and study flashcards to learn anything efficiently. Our spaced repetition system optimizes your learning experience.",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80",
    },
    {
      title: "Create Custom Decks",
      description: "Organize your learning by creating decks for different subjects. Add cards with text, images, and examples.",
      imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80",
    },
    {
      title: "Study Smarter",
      description: "Track your progress and focus on what you need to review most. Our algorithms adapt to your learning pace.",
      imageUrl: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
    },
  ];

  const handleNextStep = () => {
    if (currentStep < onboardingSteps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleComplete = () => {
    navigate("/dashboard");
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex justify-end p-4">
        <Button variant="ghost" size="sm" onClick={handleSkip}>
          Skip
        </Button>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <OnboardingCard
            title={onboardingSteps[currentStep - 1].title}
            description={onboardingSteps[currentStep - 1].description}
            imageUrl={onboardingSteps[currentStep - 1].imageUrl}
            step={currentStep}
            totalSteps={onboardingSteps.length}
            onNextStep={handleNextStep}
            onComplete={handleComplete}
            isLastStep={currentStep === onboardingSteps.length}
          />
        </div>
      </div>
    </div>
  );
};

export default Welcome;
