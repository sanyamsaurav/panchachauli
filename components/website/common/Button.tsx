"use client";

import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "outline" | "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  onClick?: () => void;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  href,
  onClick,
  icon: Icon,
  iconPosition = "right",
  className = "",
  disabled = false,
  type = "button",
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  const variantStyles = {
    outline:
      "border-2 border-black text-gray-900 hover:bg-black hover:text-white",
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white",
    secondary:
      "bg-gray-900 hover:bg-gray-800 text-white",
    ghost:
      "text-gray-900 hover:bg-gray-100",
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-xs rounded-full",
    md: "px-6 py-3 text-sm rounded-full",
    lg: "px-10 py-4 text-sm rounded-full",
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  const content = (
    <>
      {Icon && iconPosition === "left" && <Icon className="mr-2 w-4 h-4" />}
      {children}
      {Icon && iconPosition === "right" && <Icon className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={`${combinedClassName} group`}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${combinedClassName} group`}
    >
      {content}
    </button>
  );
}

// Filter/Tag Button
interface FilterButtonProps {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function FilterButton({
  children,
  active = false,
  onClick,
  className = "",
}: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
        active
          ? "bg-gray-900 text-white"
          : "border border-gray-200 text-gray-700 hover:bg-gray-50"
      } ${className}`}
    >
      {children}
    </button>
  );
}

// Show More Button
interface ShowMoreButtonProps {
  onClick: () => void;
  text?: string;
  className?: string;
}

export function ShowMoreButton({
  onClick,
  text = "Show More",
  className = "",
}: ShowMoreButtonProps) {
  return (
    <div className="text-center mt-12">
      <button
        onClick={onClick}
        className={`px-8 py-3 border-2 border-black text-gray-900 font-bold uppercase tracking-widest text-sm hover:bg-black hover:text-white transition-all ${className}`}
      >
        {text}
      </button>
    </div>
  );
}
