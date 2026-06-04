"use client";

import * as React from "react";
import Link, { type LinkProps } from "next/link";
import { motion, useReducedMotion } from "framer-motion";

import { cn } from "@/lib/utils";

type MotionLinkProps = LinkProps & {
  className?: string;
  children: React.ReactNode;
};

const MotionNextLink = motion.create(Link);

export function MotionLink({ className, children, ...props }: MotionLinkProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <MotionNextLink
      {...props}
      className={cn("inline-flex", className)}
      whileHover={prefersReducedMotion ? undefined : { y: -2 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 520, damping: 34, mass: 0.7 }}
    >
      {children}
    </MotionNextLink>
  );
}

