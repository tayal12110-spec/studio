'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Handshake, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  {
    href: '/dashboard',
    icon: Home,
    label: 'Home',
  },
  {
    href: '#',
    icon: Handshake,
    label: 'CRM',
  },
  {
    href: '#',
    icon: Settings,
    label: 'Settings',
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <main className="flex-1 pb-20">{children}</main>
      <footer className="fixed bottom-0 z-10 w-full border-t bg-card">
        <nav className="grid grid-cols-3">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 py-2 text-sm font-medium',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              <item.icon className="h-6 w-6" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      </footer>
    </div>
  );
}
