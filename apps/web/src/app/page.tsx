import { Show } from '@clerk/nextjs';
import {
  FileText,
  Sparkles,
  MessageCircle,
  Shield,
  Upload,
  ScanSearch,
  BookOpen,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { BrandLogo } from '@/components/brand/brand-logo';
import { MotionLink } from '@/components/motion/motion-link';
import { HomeHero } from '@/components/home/home-hero';
import {
  Reveal,
  RevealList,
  RevealListItem,
  Stagger,
  StaggerItem,
} from '@/components/motion/reveal';

/* Design system tokens: spacing (xs=4, sm=8, md=16, lg=24, xl=32, 2xl=48, 3xl=64) */
const sectionPadding = 'py-2xl md:py-3xl';
const containerClass = 'mx-auto max-w-5xl px-lg';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/95 backdrop-blur transition-[box-shadow] duration-300 supports-[backdrop-filter]:bg-background/80 hover:shadow-sm">
        <nav className={cn(containerClass, 'flex h-16 items-center justify-between')}>
          <BrandLogo size="md" />
          <div className="flex items-center gap-md">
            <Show when="signed-out">
              <MotionLink
                href="/sign-in"
                className="text-sm font-medium text-muted-foreground transition-colors duration-200 hover:text-brand"
              >
                Sign in
              </MotionLink>
              <MotionLink
                href="/sign-up"
                className={cn(
                  buttonVariants(),
                  'shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-primary/20'
                )}
              >
                Get started
              </MotionLink>
            </Show>
            <Show when="signed-in">
              <MotionLink
                href="/dashboard"
                className={cn(
                  buttonVariants(),
                  'shadow-sm transition-shadow duration-300 hover:shadow-md hover:shadow-primary/20'
                )}
              >
                Dashboard
              </MotionLink>
            </Show>
          </div>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero - typography tokens: xs, sm, base, lg, xl, 2xl, 3xl */}
        <div className={cn(sectionPadding, containerClass)}>
          <Show when="signed-in">
            <HomeHero signedIn />
          </Show>
          <Show when="signed-out">
            <HomeHero signedIn={false} />
          </Show>
        </div>

        {/* Problem */}
        <section className={cn(sectionPadding, 'bg-muted/50')}>
          <div className={containerClass}>
            <Reveal>
              <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
                The problem
              </p>
              <h2 className="mt-sm text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Lab results shouldn&apos;t feel like a foreign language
              </h2>
              <p className="mx-auto mt-lg max-w-2xl text-center text-lg text-muted-foreground">
                You get a PDF full of abbreviations, numbers, and reference ranges—and no
                idea what&apos;s normal, what&apos;s not, or what to do next. Googling leads to
                anxiety. Waiting for a doctor&apos;s call can take days.
              </p>
              <RevealList className="mx-auto mt-xl grid max-w-2xl gap-md text-muted-foreground sm:grid-cols-2">
                {[
                  'Confusing abbreviations and units',
                  'Reference ranges without context',
                  'Uncertainty about what needs follow-up',
                  'Delayed peace of mind (or clarity)',
                ].map((item, i) => (
                  <RevealListItem
                    key={item}
                    className="group flex items-center gap-lg transition-colors duration-200 hover:text-foreground"
                  >
                    <span
                      className={cn(
                        'h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-200 group-hover:scale-150',
                        i % 2 === 0 ? 'bg-primary' : 'bg-brand'
                      )}
                    />
                    {item}
                  </RevealListItem>
                ))}
              </RevealList>
            </Reveal>
          </div>
        </section>

        {/* Solution */}
        <section className={sectionPadding}>
          <div className={containerClass}>
            <Reveal>
              <p className="text-center text-sm font-medium uppercase tracking-wider text-brand">
                The solution
              </p>
              <h2 className="mt-sm text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Your reports, explained by AI—instantly
              </h2>
              <p className="mx-auto mt-lg max-w-2xl text-center text-lg text-muted-foreground">
                Labby-dabby reads your lab report and turns it into a clear, personalized
                summary. You see what&apos;s in range, what isn&apos;t, and what it means in
                plain language—so you can talk to your doctor with confidence and less stress.
              </p>
            </Reveal>
            <div className="mt-xl flex justify-center">
              <Reveal delay={0.08}>
                <Card className="max-w-2xl p-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:ring-2 hover:ring-brand/20 md:p-2xl">
                  <CardHeader className="p-0">
                    <div className="flex items-center gap-lg text-brand">
                      <Sparkles className="h-8 w-8 transition-transform duration-300 group-hover/card:scale-110" />
                      <CardTitle className="text-lg">Powered by AI built for health</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 pt-md">
                    <CardDescription className="text-base">
                      We use advanced language models trained to interpret lab results and
                      explain them in a way that&apos;s accurate, empathetic, and easy to
                      understand—without replacing your doctor.
                    </CardDescription>
                  </CardContent>
                </Card>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className={cn(sectionPadding, 'bg-muted/50')}>
          <div className={containerClass}>
            <Reveal>
              <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Features
              </p>
              <h2 className="mt-sm text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Everything you need to take control of your results
              </h2>
            </Reveal>
            <Stagger className="mt-xl grid gap-xl sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: FileText,
                  title: 'Upload any report',
                  description:
                    'Drop your PDF lab report. We support common formats from major labs and clinics.',
                },
                {
                  icon: Sparkles,
                  title: 'Instant AI analysis',
                  description:
                    'Get a clear summary: what’s normal, what’s not, and what each result means for you.',
                },
                {
                  icon: MessageCircle,
                  title: 'Ask follow-up questions',
                  description:
                    'Chat with an AI assistant about your report anytime—no more endless searching.',
                },
                {
                  icon: Shield,
                  title: 'Private and secure',
                  description:
                    'Your data is encrypted and used only to serve you. We never sell your health information.',
                },
              ].map(({ icon: Icon, title, description }) => (
                <StaggerItem key={title}>
                  <Card
                    className="transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:ring-1 hover:ring-brand/15"
                    size="sm"
                  >
                    <CardHeader>
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover/card:rotate-[-3deg] group-hover/card:bg-brand/10 group-hover/card:text-brand">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="mt-md">{title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{description}</CardDescription>
                    </CardContent>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* How it works */}
        <section className={sectionPadding}>
          <div className={containerClass}>
            <Reveal>
              <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
                How it works
              </p>
              <h2 className="mt-sm text-center text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Three simple steps
              </h2>
            </Reveal>
            <Stagger className="mt-2xl grid gap-xl md:grid-cols-3">
              {[
                {
                  step: '1',
                  icon: Upload,
                  title: 'Upload your report',
                  description:
                    'Sign up and upload your lab report PDF. We accept results from most labs and providers.',
                },
                {
                  step: '2',
                  icon: ScanSearch,
                  title: 'We analyze it',
                  description:
                    'Our AI reads your results and generates a clear summary with plain-language explanations.',
                },
                {
                  step: '3',
                  icon: BookOpen,
                  title: 'Understand and act',
                  description:
                    'Review your summary, ask questions in the chat, and share with your doctor if you want.',
                },
              ].map(({ step, icon: Icon, title, description }) => (
                <StaggerItem key={step}>
                  <div className="group/step text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border-2 border-primary bg-primary/5 text-primary transition-all duration-300 group-hover/step:scale-105 group-hover/step:border-brand group-hover/step:bg-brand/10 group-hover/step:text-brand group-hover/step:shadow-md">
                      <Icon className="h-6 w-6 transition-transform duration-300 group-hover/step:scale-110" />
                    </div>
                    <span className="mt-md inline-block text-sm font-medium text-brand">
                      Step {step}
                    </span>
                    <h3 className="mt-sm font-semibold text-foreground">{title}</h3>
                    <p className="mt-sm text-muted-foreground">{description}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </section>

        {/* Final CTA */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-brand text-primary-foreground">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(255,255,255,0.08),transparent)]"
          />
          <div className={cn(sectionPadding, containerClass, 'relative text-center')}>
            <Reveal>
              <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
                Ready to understand your lab results?
              </h2>
              <p className="mx-auto mt-md max-w-xl text-primary-foreground/90">
                Join Labby-dabby and turn confusing numbers into clear, actionable
                insights—in minutes.
              </p>
              <div className="mt-xl">
                <Show when="signed-out">
                  <MotionLink
                    href="/sign-up"
                    className={cn(
                      buttonVariants({ variant: 'secondary', size: 'lg' }),
                      'gap-sm bg-primary-foreground text-primary shadow-lg transition-all duration-300 hover:bg-primary-foreground hover:shadow-xl hover:brightness-105'
                    )}
                  >
                    Create free account
                    <ArrowRight className="h-4 w-4" />
                  </MotionLink>
                </Show>
                <Show when="signed-in">
                  <MotionLink
                    href="/dashboard"
                    className={cn(
                      buttonVariants({ variant: 'secondary', size: 'lg' }),
                      'gap-sm bg-primary-foreground text-primary shadow-lg transition-all duration-300 hover:bg-primary-foreground hover:shadow-xl hover:brightness-105'
                    )}
                  >
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </MotionLink>
                </Show>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30">
        <div className={cn(containerClass, 'py-xl')}>
          <div className="flex flex-col items-center justify-between gap-lg sm:flex-row">
            <BrandLogo size="sm" />
            <nav className="flex flex-wrap items-center justify-center gap-lg text-sm text-muted-foreground">
              <MotionLink href="/sign-in" className="transition-colors duration-200 hover:text-brand">
                Sign in
              </MotionLink>
              <MotionLink href="/sign-up" className="transition-colors duration-200 hover:text-brand">
                Sign up
              </MotionLink>
              <MotionLink href="/dashboard" className="transition-colors duration-200 hover:text-brand">
                Dashboard
              </MotionLink>
            </nav>
          </div>
          <p className="mt-lg text-center text-sm text-muted-foreground sm:text-left">
            © {new Date().getFullYear()} Labby-dabby. AI-powered lab report analysis for
            patients.
          </p>
        </div>
      </footer>
    </div>
  );
}
