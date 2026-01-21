import { UserNav } from '@/components/dashboard/user-nav';

type DashboardHeaderProps = {
  title: string;
  children?: React.ReactNode;
};

export function DashboardHeader({ title, children }: DashboardHeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <div className="flex items-center gap-2">
        <h1 className="font-headline text-xl font-semibold tracking-tight md:text-2xl">
          {title}
        </h1>
      </div>
      <div className="flex items-center gap-4">
        {children}
        <UserNav />
      </div>
    </header>
  );
}
