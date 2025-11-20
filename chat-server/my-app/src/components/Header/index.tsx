import { ProfileDropdown } from '@/components/Header/ProfileDropdown';
import { Search } from '@/components/Header/Search';
import { ThemeSwitch } from '@/components/Header/ThemeSwitch';
import { cn } from '@/lib/utils';
import React from 'react';

interface HeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLDivElement>;
}

export const Header = ({
  className,
  fixed,
  children,
  ...props
}: HeaderProps) => {
  const [offset, setOffset] = React.useState(0);

  return (
    <div
      className={cn(
        'bg-background flex h-16 items-center gap-3 p-4 sm:gap-4',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-md',
        offset > 10 && fixed ? 'shadow-sm' : 'shadow-none',
        className
      )}
      {...props}
    >
      {/* <SidebarTrigger variant="outline" className="scale-125 sm:scale-100" /> */}
      <Search />
      <div className="ml-auto flex items-center gap-4">
        <ThemeSwitch />
        <ProfileDropdown />
      </div>
    </div>
  );
};
