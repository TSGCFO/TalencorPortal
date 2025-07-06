import { cn } from "@/lib/utils";
import talencorLogo from "@assets/Design (1)_1751770740359.png";

interface TalencorLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white" | "gradient";
}

export default function TalencorLogo({ 
  className, 
  showText = false, // Default to false since logo already includes text
  size = "md",
  variant = "default" 
}: TalencorLogoProps) {
  const sizes = {
    sm: {
      img: "h-12",
      text: "text-xl",
      wrapper: "gap-2"
    },
    md: {
      img: "h-16",
      text: "text-2xl", 
      wrapper: "gap-3"
    },
    lg: {
      img: "h-24",
      text: "text-4xl",
      wrapper: "gap-4"
    }
  };

  const currentSize = sizes[size];
  
  const textVariants = {
    default: "text-gradient font-extrabold",
    white: "text-white font-extrabold",
    gradient: "text-gradient font-extrabold"
  };

  return (
    <div className={cn("flex items-center", currentSize.wrapper, className)}>
      <img
        src={talencorLogo}
        alt="Talencor Staffing"
        className={cn(
          currentSize.img,
          "object-contain",
          variant === "white" ? "brightness-0 invert" : ""
        )}
      />
      
      {showText && (
        <div className="flex flex-col">
          <span className={cn(currentSize.text, textVariants[variant])}>
            Talencor
          </span>
          {size === "lg" && (
            <span className="text-sm text-muted-foreground font-medium -mt-1">
              Staffing Solutions
            </span>
          )}
        </div>
      )}
    </div>
  );
}