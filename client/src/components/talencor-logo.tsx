import logoIcon from "@assets/Design (1)_1751772216692.png";
import logoFull from "@assets/047-Talencor Logo Final.pdf_1751772208643.png";

interface TalencorLogoProps {
  variant?: 'full' | 'icon';
  className?: string;
}

export default function TalencorLogo({ variant = 'full', className = '' }: TalencorLogoProps) {
  if (variant === 'icon') {
    // Icon version - hexagonal logo
    return (
      <img 
        src={logoIcon} 
        alt="Talencor Logo" 
        className={`${className}`}
      />
    );
  }

  // Full logo version with text
  return (
    <img 
      src={logoFull} 
      alt="Talencor Staffing Logo" 
      className={`${className}`}
    />
  );
}