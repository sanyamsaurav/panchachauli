"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <div
      className={`group bg-white rounded shadow hover:shadow-xl transition overflow-hidden cursor-pointer ${className}`}
    >
      {children}
    </div>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export function CardImage({
  src,
  alt,
  className = "",
  aspectRatio = "aspect-[4/3]",
}: CardImageProps) {
  return (
    <div className={`relative overflow-hidden ${aspectRatio} ${className}`}>
      <img
        src={src}
        alt={alt}
        className="object-cover w-full h-full group-hover:scale-105 transition duration-500"
      />
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  return (
    <h3
      className={`text-lg md:text-xl font-semibold text-gray-900 group-hover:text-blue-700 transition-colors ${className}`}
    >
      {children}
    </h3>
  );
}

interface CardMetaProps {
  children: React.ReactNode;
  className?: string;
}

export function CardMeta({ children, className = "" }: CardMetaProps) {
  return (
    <p className={`text-sm text-gray-500 mb-2 uppercase tracking-wider ${className}`}>
      {children}
    </p>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription({ children, className = "" }: CardDescriptionProps) {
  return (
    <p className={`text-sm text-gray-600 leading-relaxed line-clamp-2 ${className}`}>
      {children}
    </p>
  );
}

interface CardPriceProps {
  children: React.ReactNode;
  className?: string;
}

export function CardPrice({ children, className = "" }: CardPriceProps) {
  return (
    <p className={`text-lg font-bold text-blue-600 ${className}`}>
      {children}
    </p>
  );
}

interface CardButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "outline" | "primary";
  className?: string;
}

export function CardButton({
  children,
  href,
  onClick,
  variant = "outline",
  className = "",
}: CardButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-bold uppercase tracking-widest text-xs transition-all";

  const variantStyles = {
    outline:
      "border border-black hover:bg-black hover:text-white px-5 py-2.5",
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-full",
  };

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {children}
        <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// Combined Card for convenience
interface ContentCardProps {
  image: string;
  imageAlt: string;
  meta?: string;
  title: string;
  description?: string;
  price?: string;
  button?: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
}

export function ContentCard({
  image,
  imageAlt,
  meta,
  title,
  description,
  price,
  button,
  secondaryButton,
}: ContentCardProps) {
  return (
    <Card>
      <CardImage src={image} alt={imageAlt} />
      <CardContent>
        {meta && <CardMeta>{meta}</CardMeta>}
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription className="mt-2">{description}</CardDescription>}
        {price && <CardPrice className="mt-3">{price}</CardPrice>}
        
        <div className="flex gap-3 mt-4">
          {button && (
            <CardButton href={button.href}>{button.text}</CardButton>
          )}
          {secondaryButton && (
            <CardButton href={secondaryButton.href}>
              {secondaryButton.text}
            </CardButton>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
