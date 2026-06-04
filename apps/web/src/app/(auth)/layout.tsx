import { PageTransition } from '@/components/motion/page-transition';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <PageTransition>{children}</PageTransition>
    </div>
  );
}
