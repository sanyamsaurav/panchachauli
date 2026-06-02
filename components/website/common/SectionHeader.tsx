"use client";

import { MoveRight } from "lucide-react";
import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  action?: {
    text: string;
    href: string;
  };
}

export function SectionHeader({
  title,
  subtitle,
  align = "left",
  action,
}: SectionHeaderProps) {
  if (align === "center") {
    return (
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight text-gray-900 mb-3">
          {title}
        </h2>
        {subtitle && (
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        )}
        {action && (
          <Link
            href={action.href}
            className="inline-flex items-center text-blue-600 font-bold uppercase tracking-widest text-sm pt-4 group"
          >
            {action.text}
            <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex justify-between items-end mb-12">
      <div>
        <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-gray-900 mb-2">
          {title}
        </h2>
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className="hidden md:inline-flex items-center text-gray-900 font-bold uppercase tracking-widest text-xs group"
        >
          {action.text}
          <MoveRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
        </Link>
      )}
    </div>
  );
}

// Compact section header (like in the old components)
interface CompactSectionHeaderProps {
  title: string;
  subtitle?: string;
}

export function CompactSectionHeader({ title, subtitle }: CompactSectionHeaderProps) {
  return (
    <>
      {subtitle && (
        <h2 className="text-sm tracking-widest text-gray-500 text-center mb-2">
          {subtitle}
        </h2>
      )}
      <h3 className="text-lg tracking-widest text-gray-900 text-center font-bold mb-8">
        {title}
      </h3>
    </>
  );
}
