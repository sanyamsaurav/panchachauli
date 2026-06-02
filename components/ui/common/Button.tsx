import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/utils/cn";

type ButtonVariant = "primary" | "primary-dark" | "primary-hard" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg" | "icon";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: React.ReactNode;
  asChild?: boolean;
}

export default function Button({
  href,
  onClick,
  variant = "primary",
  size = "default",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  const buttonClassName = cn(buttonVariants({ variant: variant as any, size: size as any }), className);

  // If href is provided, render as Link with button styling
  if (href) {
    return (
      <Link href={href} className={buttonClassName} onClick={onClick}>
        {children}
      </Link>
    );
  }

  // Otherwise render as button
  return (
    <button
      className={buttonClassName}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}

