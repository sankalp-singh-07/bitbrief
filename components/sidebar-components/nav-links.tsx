'use client';

import { type LucideIcon } from 'lucide-react';

import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from '@/components/ui/sidebar';

export function NavLinks({
	links,
}: {
	links: {
		name: string;
		url: string;
		icon: LucideIcon;
	}[];
}) {
	const { isMobile } = useSidebar();

	return (
		<SidebarGroup className="group-data-[collapsible=icon]:hidden">
			<SidebarMenu>
				{links.map((link) => (
					<SidebarMenuItem key={link.name}>
						<SidebarMenuButton asChild>
							<a href={link.url}>
								<link.icon />
								<span>{link.name}</span>
							</a>
						</SidebarMenuButton>
					</SidebarMenuItem>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
