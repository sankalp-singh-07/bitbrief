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
import { useUserData } from '@/lib/useUserdata';
import { useRouter } from 'next/navigation';
import { useClerk } from '@clerk/nextjs';

export function UserDropdown() {
	const { isMobile } = useSidebar();
	const user = useUserData();
	const router = useRouter();
	const { signOut } = useClerk();

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
						{user.userImg ? (
							<AvatarImage src={user.userImg} alt={user.userName} />
						) : null}
						<AvatarFallback className="rounded-lg">
							CN
						</AvatarFallback>
					</Avatar>
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="truncate font-medium">
							{user.userName}
						</span>
						<span className="truncate text-xs">
							{user.userEmail}
						</span>
					</div>
				</div>
			</DropdownMenuLabel>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/upgrade')}>
					<Sparkles />
					Upgrade to Pro
				</DropdownMenuItem>
			</DropdownMenuGroup>
			<DropdownMenuSeparator />
			<DropdownMenuGroup>
				<DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/account')}>
					<BadgeCheck />
					Account
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/billing')}>
					<CreditCard />
					Billing
				</DropdownMenuItem>
				<DropdownMenuItem className="cursor-pointer" onClick={() => router.push('/notifications')}>
					<Bell />
					Notifications
				</DropdownMenuItem>
			</DropdownMenuGroup>
			<DropdownMenuSeparator />
			<DropdownMenuItem className="cursor-pointer hover:bg-red-500 hover:text-white" onClick={() => signOut()}>
				<LogOut />
				Log out
			</DropdownMenuItem>
		</DropdownMenuContent>
	);
}
