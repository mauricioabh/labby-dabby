import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { SidebarProvider } from '@/components/layout/sidebar-provider';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { AppTopbar } from '@/components/layout/app-topbar';
import { ensureUserInDatabase } from '@/lib/ensure-user-in-db';
import { PageTransition } from '@/components/motion/page-transition';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  await ensureUserInDatabase();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-muted/30">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <AppTopbar />
          <main className="flex-1 overflow-auto">
            <PageTransition className="h-full">{children}</PageTransition>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
