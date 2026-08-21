import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
  className?: string;
  size?: number;
};

export function StarRating({ rating, className, size = 14 }: StarRatingProps) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      className={className}
      role="img"
      aria-label={`${clamped} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          strokeWidth={1.5}
          aria-hidden="true"
          fill={index < clamped ? "currentColor" : "none"}
        />
      ))}
    </div>
  );
}
