import { cn } from "@/lib/utils";

interface TalencorLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "white" | "gradient";
}

export default function TalencorLogo({ 
  className, 
  showText = true, 
  size = "md",
  variant = "default" 
}: TalencorLogoProps) {
  const sizes = {
    sm: {
      icon: "h-10 w-10",
      text: "text-xl",
      wrapper: "gap-2",
      fontSize: "text-lg"
    },
    md: {
      icon: "h-12 w-12",
      text: "text-2xl",
      wrapper: "gap-3",
      fontSize: "text-xl"
    },
    lg: {
      icon: "h-16 w-16",
      text: "text-4xl",
      wrapper: "gap-4",
      fontSize: "text-2xl"
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
      {/* Enhanced Logo Icon with modern design */}
      <div className="relative group">
        <div className={cn(
          "absolute inset-0 rounded-xl opacity-30 blur-xl transition-all duration-500 group-hover:opacity-50",
          variant === "white" ? "bg-white" : "talencor-gradient"
        )} />
        <div className={cn(
          "relative flex items-center justify-center rounded-xl font-bold shadow-lg transition-all duration-300 group-hover:scale-105",
          currentSize.icon,
          currentSize.fontSize,
          variant === "white" 
            ? "bg-white/20 backdrop-blur-sm text-white border border-white/30" 
            : "talencor-gradient text-white"
        )}>
          <svg viewBox="0 0 24 24" fill="none" className="w-full h-full p-2">
            <path 
              d="M12 2L2 7V17C2 19.21 3.79 21 6 21H18C20.21 21 22 19.21 22 17V7L12 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M12 7V21M7 10H17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      
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

// Note: Once the logo files in talencorLogos directory are converted to web format (SVG/PNG),
// replace the letter "T" div with:
// <img src="/logo.png" alt="Talencor Logo" className={currentSize.icon} />
// or use an SVG component