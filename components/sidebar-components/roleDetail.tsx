'use client';

import { Award, Menu, ShieldCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserDropdown } from './userDropdown';
import { useUserData } from '@/lib/useUserdata';
import { useUserStore } from '@/store/useUserStore';

export function RoleDetail() {
	const user = useUserData();
	const { plan } = useUserStore();

	return (
		<div className="flex justify-between items-center w-full">
			<div className="hidden sm:block">
				<p className="text-sm font-medium">Welcome {user.userName} 🫡</p>
			</div>
			<div className="ml-auto flex items-center gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8" aria-label="Toggle user menu">
							<Menu size={16} />
						</Button>
					</DropdownMenuTrigger>
					<UserDropdown />
				</DropdownMenu>
				{plan === 'PRO' ? (
					<Badge
						variant="default"
						className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black font-semibold flex items-center gap-2 border-0 shadow-lg shadow-yellow-500/20 px-3 py-1 rounded-full animate-pulse"
					>
						<ShieldCheck size={16} strokeWidth={2.5} className="text-black animate-spin" style={{ animationDuration: '3s' }} />
						Premium User
					</Badge>
				) : (
					<Badge
						variant="secondary"
						className="bg-zinc-500/20 text-zinc-500 border border-zinc-500/30 flex items-center gap-2 px-3 py-1 rounded-full hover:bg-zinc-500/30 dark:text-zinc-400"
					>
						<Award size={16} strokeWidth={2} />
						Free User
					</Badge>
				)}
			</div>
		</div>
	);
}
