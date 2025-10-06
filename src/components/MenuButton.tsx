import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface MenuButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
}

export const MenuButton = ({ 
  children, 
  onClick, 
  variant = "primary",
  className,
  disabled 
}: MenuButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "text-lg font-bold transition-all duration-300",
        variant === "primary" && [
          "bg-primary text-primary-foreground",
          "hover:shadow-[0_0_20px_hsl(var(--primary))]",
          "hover:scale-105",
        ],
        variant === "secondary" && [
          "bg-secondary text-secondary-foreground",
          "hover:bg-secondary/80",
        ],
        className
      )}
    >
      {children}
    </Button>
  );
};
