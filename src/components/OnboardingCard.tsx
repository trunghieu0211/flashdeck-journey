
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface OnboardingCardProps {
  title: string;
  description: string;
  imageUrl: string;
  step: number;
  totalSteps: number;
  onNextStep: () => void;
  onComplete: () => void;
  isLastStep: boolean;
}

const OnboardingCard: React.FC<OnboardingCardProps> = ({
  title,
  description,
  imageUrl,
  step,
  totalSteps,
  onNextStep,
  onComplete,
  isLastStep,
}) => {
  return (
    <div className="flex flex-col h-full animate-fade-in">
      <div className="relative h-48 md:h-64 mb-6 overflow-hidden rounded-lg">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
      </div>

      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="text-muted-foreground mb-6">{description}</p>
      </div>

      <div className="mt-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-2">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "onboarding-dot",
                  i === step - 1 ? "active" : ""
                )}
              ></div>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {step} / {totalSteps}
          </span>
        </div>

        <Button
          className="w-full"
          onClick={isLastStep ? onComplete : onNextStep}
        >
          {isLastStep ? "Get Started" : "Continue"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default OnboardingCard;
