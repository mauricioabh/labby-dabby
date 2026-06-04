"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui";
import { BrandLogo } from "@/components/brand/brand-logo";
import { MotionLink } from "@/components/motion/motion-link";

type HomeHeroProps = {
  className?: string;
  signedIn: boolean;
};

export function HomeHero({ className, signedIn }: HomeHeroProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className={cn("relative overflow-hidden text-center", className)}>
      {/* Soft backdrop — blue + brand teal */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute left-[-120px] top-[-140px] h-[320px] w-[320px] rounded-full bg-primary/18 blur-3xl"
          style={
            prefersReducedMotion
              ? undefined
              : { animation: "hero-float-a 9s ease-in-out infinite" }
          }
        />
        <div
          className="absolute right-[-140px] top-[-80px] h-[360px] w-[360px] rounded-full bg-brand/14 blur-3xl"
          style={
            prefersReducedMotion
              ? undefined
              : { animation: "hero-float-b 11s ease-in-out infinite" }
          }
        />
        <div
          className="absolute left-1/2 top-10 h-24 w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-primary/12 to-transparent blur-2xl"
          style={
            prefersReducedMotion
              ? undefined
              : { animation: "hero-shimmer 6.5s ease-in-out infinite" }
          }
        />
      </div>

      <motion.div
        className="relative"
        initial="hidden"
        animate="show"
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.08 } },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            },
          }}
          className="mb-lg flex justify-center"
        >
          <motion.div
            data-fm="hero-logo"
            animate={
              prefersReducedMotion
                ? undefined
                : { y: [0, -6, 0] }
            }
            transition={
              prefersReducedMotion
                ? undefined
                : { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <BrandLogo size="md" showText={false} />
          </motion.div>
        </motion.div>

        <motion.p
          className="mb-md text-sm font-medium uppercase tracking-wider text-primary"
          variants={{
            hidden: { opacity: 0, y: 8 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          AI-powered lab report analysis
        </motion.p>

        <motion.h1
          className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-3xl"
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          Understand your lab results,{" "}
          <span className="bg-gradient-to-r from-primary via-primary to-brand bg-clip-text text-transparent">
            in plain language
          </span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-lg max-w-2xl text-lg text-muted-foreground"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          Stop guessing what those numbers mean. Upload your report, get an instant
          analysis in everyday language, and know when to act—or when to relax.
        </motion.p>

        <motion.div
          className="mt-xl flex flex-wrap items-center justify-center gap-md"
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
            },
          }}
        >
          {signedIn ? (
            <MotionLink
              href="/dashboard"
              className={cn(
                buttonVariants({ size: "lg" }),
                "gap-sm shadow-md shadow-primary/15 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/25"
              )}
            >
              Go to Dashboard
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-0.5" />
            </MotionLink>
          ) : (
            <>
              <MotionLink
                href="/sign-up"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-sm shadow-md shadow-primary/15 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/25"
                )}
              >
                Get started free
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-0.5" />
              </MotionLink>
              <MotionLink
                href="/sign-in"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "transition-colors duration-300 hover:border-brand/40 hover:bg-brand/5 hover:text-foreground"
                )}
              >
                Sign in
              </MotionLink>
            </>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
