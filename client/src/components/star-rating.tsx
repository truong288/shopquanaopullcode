import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  readonly?: boolean;
  onChange?: (rating: number) => void;
  className?: string;
}

export function StarRating({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showValue = false,
  readonly = true,
  onChange,
  className 
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5", 
    lg: "w-6 h-6"
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  };

  const handleStarClick = (starRating: number) => {
    if (!readonly && onChange) {
      onChange(starRating);
    }
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      <div className="flex">
        {Array.from({ length: maxRating }, (_, index) => {
          const starRating = index + 1;
          const isFilled = starRating <= rating;
          const isHalfFilled = !isFilled && starRating - 0.5 <= rating;
          
          return (
            <button
              key={index}
              type="button"
              disabled={readonly}
              onClick={() => handleStarClick(starRating)}
              className={cn(
                "relative transition-colors",
                !readonly && "hover:scale-110 cursor-pointer",
                readonly && "cursor-default"
              )}
              data-testid={`star-${starRating}`}
            >
              <Star 
                className={cn(
                  sizeClasses[size],
                  "transition-colors",
                  isFilled ? "fill-yellow-400 text-yellow-400" : 
                  isHalfFilled ? "fill-yellow-200 text-yellow-400" :
                  "fill-gray-200 text-gray-200 dark:fill-gray-700 dark:text-gray-700"
                )}
              />
            </button>
          );
        })}
      </div>
      {showValue && (
        <span className={cn("font-medium ml-1", textSizeClasses[size])}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}