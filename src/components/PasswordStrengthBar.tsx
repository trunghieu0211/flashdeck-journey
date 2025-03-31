
import React, { useMemo } from "react";

interface PasswordStrengthBarProps {
  password: string;
}

const PasswordStrengthBar: React.FC<PasswordStrengthBarProps> = ({ password }) => {
  const strength = useMemo(() => {
    if (!password) return 0;
    
    let score = 0;
    
    // Length
    if (password.length > 7) score++;
    if (password.length > 10) score++;
    
    // Complexity
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    
    return Math.min(score, 4);
  }, [password]);

  const getLabel = () => {
    if (strength === 0) return "Too weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  const getColor = () => {
    if (strength === 0) return "bg-gray-300";
    if (strength === 1) return "bg-red-500";
    if (strength === 2) return "bg-orange-500";
    if (strength === 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="mt-1">
      <div className="flex items-center gap-1 mb-1">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`h-1 flex-1 rounded-full ${i < strength ? getColor() : "bg-gray-200"}`}
          ></div>
        ))}
      </div>
      {password && (
        <p className="text-xs text-muted-foreground">
          Password strength: <span className="font-medium">{getLabel()}</span>
        </p>
      )}
    </div>
  );
};

export default PasswordStrengthBar;
