import { Award, Menu } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserDropdown } from './userDropdown';
import { useUserData } from '@/lib/useUserdata';

export function RoleDetail() {
	const user = useUserData();
	return (
		<div className="flex justify-between items-center w-full">
			<div className="hidden sm:block">
				<p className="text-sm font-medium">Welcome {user.userName} 🫡</p>
			</div>
			<div className="ml-auto flex items-center gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
							<Menu size={16} />
						</Button>
					</DropdownMenuTrigger>
					<UserDropdown />
				</DropdownMenu>
				<Badge
					variant="secondary"
					className="bg-secondary text-white dark:bg-primary flex items-center gap-2"
				>
					<Award size={16} strokeWidth={2} />
					Free User
				</Badge>
			</div>
		</div>
	);
}
