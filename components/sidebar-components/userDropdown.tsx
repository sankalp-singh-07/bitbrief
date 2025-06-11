'use client';

import { BadgeCheck, Bell, CreditCard, LogOut, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';

export function UserDropdown({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { isMobile } = useSidebar();

	return (
		<DropdownMenuContent
			className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
			side={isMobile ? 'bottom' : 'right'}
			align="end"
			sideOffset={isMobile ? 8 : 12}
			alignOffset={isMobile ? 16 : 0}
		>
			<DropdownMenuLabel className="p-0 font-normal">
				<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
					<Avatar className="h-8 w-8 rounded-lg">
						<AvatarImage src={user.avatar} alt={user.name} />
						<AvatarFallback className="rounded-lg">
							CN
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">
							{user.name}
						</span>
						<span className="truncate text-xs">{user.email}</span>
					</div>
				</div>
			</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<DropdownMenuItem className="cursor-pointer">
					<Sparkles />
					Upgrade to Pro
				</DropdownMenuItem>
			</DropdownMenuGroup>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<DropdownMenuItem className="cursor-pointer">
					<BadgeCheck />
					Account
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer">
					<CreditCard />
					Billing
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer">
					<Bell />
					Notifications
				</DropdownMenuItem>
			</DropdownMenuGroup>
			<DropdownMenuSeparator />
			<DropdownMenuItem className="cursor-pointer hover:bg-red-500 hover:text-white">
				<LogOut />
				Log out
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
}
