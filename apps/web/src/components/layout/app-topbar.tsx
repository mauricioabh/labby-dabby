'use client';

import Link from 'next/link';
import { UserButton } from '@clerk/nextjs';
import { PanelLeft } from 'lucide-react';
import { useSidebar } from '@/components/layout/sidebar-provider';

export function AppTopbar() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-lg">
      <div className="flex items-center gap-md">
        <button
          type="button"
          onClick={() => setCollapsed((v) => !v)}
          className="rounded-lg p-sm text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <PanelLeft className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="font-semibold text-foreground">
          Labby-dabby
        </Link>
        <nav className="ml-xl flex gap-md">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Home
          </Link>
          <Link
            href="/lab-reports"
            className="text-sm font-medium text-muted-foreground underline-offset-4 hover:bg-transparent hover:text-foreground"
          >
            Overview
          </Link>
        </nav>
      </div>
      <UserButton />
    </header>
  );
}
