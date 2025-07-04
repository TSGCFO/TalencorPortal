import { cn } from "@/lib/utils";

interface TalencorLogoProps {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function TalencorLogo({ className, showText = true, size = "md" }: TalencorLogoProps) {
  const sizes = {
    sm: {
      icon: "h-8 w-8",
      text: "text-xl",
      wrapper: "gap-2"
    },
    md: {
      icon: "h-10 w-10",
      text: "text-2xl",
      wrapper: "gap-3"
    },
    lg: {
      icon: "h-12 w-12",
      text: "text-3xl",
      wrapper: "gap-3"
    }
  };

  const currentSize = sizes[size];

  return (
    <div className={cn("flex items-center", currentSize.wrapper, className)}>
      {/* Logo Icon - Replace this with actual logo when converted */}
      <div className={cn(
        "flex items-center justify-center rounded-lg talencor-gradient text-white font-bold",
        currentSize.icon
      )}>
        T
      </div>
      
      {showText && (
        <span className={cn("font-bold text-primary", currentSize.text)}>
          Talencor
        </span>
      )}
    </div>
  );
}

// Note: Once the logo files in talencorLogos directory are converted to web format (SVG/PNG),
// replace the letter "T" div with:
// <img src="/logo.png" alt="Talencor Logo" className={currentSize.icon} />
// or use an SVG component