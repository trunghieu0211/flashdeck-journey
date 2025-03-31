
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Layers, Globe } from "lucide-react";

interface OnboardingCardProps {
  title: string;
  description: string;
  icon: string;
}

const OnboardingCard: React.FC<OnboardingCardProps> = ({
  title,
  description,
  icon,
}) => {
  const renderIcon = () => {
    switch (icon) {
      case "layers":
        return <Layers className="h-10 w-10 text-primary" />;
      case "bar-chart":
        return <BarChart className="h-10 w-10 text-primary" />;
      case "globe":
        return <Globe className="h-10 w-10 text-primary" />;
      default:
        return <Layers className="h-10 w-10 text-primary" />;
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="mb-4">{renderIcon()}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

export default OnboardingCard;
