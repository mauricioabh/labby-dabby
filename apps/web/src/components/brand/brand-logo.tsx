"use client";

import * as React from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  markClassName?: string;
  textClassName?: string;
  showText?: boolean;
  href?: string;
  size?: "sm" | "md";
};

const sizes = {
  sm: { mark: 22, gap: "gap-2", text: "text-base" },
  md: { mark: 28, gap: "gap-2.5", text: "text-lg" },
} as const;

function LogoMark({ pixelSize, className }: { pixelSize: number; className?: string }) {
  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("block shrink-0", className)}
      aria-hidden
    >
      <rect width="32" height="32" rx="8" className="fill-primary" />
      <path
        className="fill-primary-foreground"
        d="M10 10h3v10.25h8.5v2.75H10V10z"
      />
    </svg>
  );
}

export function BrandLogo({
  className,
  markClassName,
  textClassName,
  showText = true,
  href = "/",
  size = "md",
}: BrandLogoProps) {
  const prefersReducedMotion = useReducedMotion();
  const s = sizes[size];

  const content = (
    <span className={cn("inline-flex items-center", s.gap, className)}>
      <motion.span
        className={cn("relative flex shrink-0 items-center justify-center", markClassName)}
        initial={false}
        whileHover={
          prefersReducedMotion
            ? undefined
            : { rotate: -3, scale: 1.03, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }
        }
        whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
      >
        <LogoMark pixelSize={s.mark} />
      </motion.span>
      {showText ? (
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground",
            s.text,
            textClassName
          )}
        >
          Labby-dabby
        </span>
      ) : null}
    </span>
  );

  return (
    <Link href={href} className="inline-flex items-center outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md">
      {content}
    </Link>
  );
}
