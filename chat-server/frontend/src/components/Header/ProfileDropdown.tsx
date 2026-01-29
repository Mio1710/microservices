import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { useAuthContext } from '@/context/auth-context';
import { NavLink } from 'react-router';

export function ProfileDropdown() {
  const { logout } = useAuthContext();
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>SN</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm leading-none font-medium">satnaing</p>
            <p className="text-muted-foreground text-xs leading-none">
              satnaingdev@gmail.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <NavLink to="/settings">
              Profile
              <DropdownMenuShortcut>??P</DropdownMenuShortcut>
            </NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <NavLink to="/settings">
              Billing
              <DropdownMenuShortcut>?B</DropdownMenuShortcut>
            </NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <NavLink to="/settings">
              Settings
              <DropdownMenuShortcut>?S</DropdownMenuShortcut>
            </NavLink>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <NavLink to="/login" onClick={logout}>
            Log out
          </NavLink>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
