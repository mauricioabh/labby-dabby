'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  MessageCircle,
  StickyNote,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebar } from '@/components/layout/sidebar-provider';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lab-reports', label: 'Lab Reports', icon: FileText },
  { href: '/ai-chatbot', label: 'AI Chatbot', icon: MessageCircle },
  { href: '/notes', label: 'Notes', icon: StickyNote },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  return (
    <aside
      className={cn(
        'flex flex-col border-r border-border bg-muted/30 transition-[width] duration-200 ease-in-out',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      <div
        className={cn(
          'flex h-16 items-center border-b border-border transition-all duration-200',
          collapsed ? 'justify-center px-0' : 'gap-sm px-lg'
        )}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <span className="text-lg font-bold">L</span>
        </div>
        {!collapsed && (
          <span className="truncate font-semibold text-foreground">
            Labby-dabby
          </span>
        )}
      </div>
      <nav className="flex-1 space-y-xs p-lg">
        {!collapsed && (
          <p className="px-md text-xs font-medium text-muted-foreground">
            Navigation
          </p>
        )}
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href ||
            (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                'flex items-center rounded-lg text-sm font-medium transition-colors',
                collapsed ? 'justify-center px-0 py-sm' : 'gap-md px-md py-sm',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="truncate">{label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
