
"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function WorkNestLogo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-white"
        >
          {/* Stylized Professional Figure */}
          <path
            d="M15 19V17C15 15.8954 14.1046 15 13 15H5C3.89543 15 3 15.8954 3 17V19"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle
            cx="9"
            cy="7"
            r="4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Professional Hard Hat Detail */}
          <path
            d="M6 5C6 5 7.5 3.5 9 3.5C10.5 3.5 12 5 12 5"
            stroke="#2EC2E6"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Modern Wrench / Tool Representation */}
          <path
            d="M19 8L21 6M19 8L17 6M19 8L21 10M19 8L17 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 8V21"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Accent dot on the tool */}
          <circle cx="19" cy="8" r="1" fill="#2EC2E6" />
        </svg>
        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-accent border-2 border-white shadow-sm" />
      </div>
      {!iconOnly && (
        <span className="font-headline text-2xl font-black tracking-tight text-primary">
          Work<span className="text-foreground/90">Nest</span>
        </span>
      )}
    </div>
  );
}
