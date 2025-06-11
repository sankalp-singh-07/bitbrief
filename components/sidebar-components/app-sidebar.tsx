'use client';

import * as React from 'react';
import {
	Bot,
	Heart,
	LayoutDashboard,
	LifeBuoy,
	Newspaper,
	Send,
} from 'lucide-react';

import { NavLinks } from './nav-links';
import { NavSupport } from './nav-support';
import { NavUser } from './nav-user';
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '@/components/ui/sidebar';
import { ThemeToggle } from '../theme-toggle';

const data = {
	user: {
		name: 'sankalp',
		email: 'me@example.com',
		avatar: '/avatars/shadcn.jpg',
	},
	navSupport: [
		{
			title: 'Support',
			url: '#',
			icon: LifeBuoy,
		},
		{
			title: 'Feedback',
			url: '#',
			icon: Send,
		},
	],
	links: [
		{
			name: 'Dashboard',
			url: '/dashboard',
			icon: LayoutDashboard,
		},
		{
			name: 'Newsletter',
			url: '/newsletter',
			icon: Newspaper,
		},
		{
			name: 'Watchlist',
			url: '/watchlist',
			icon: Heart,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
			{...props}
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton size="lg" asChild>
							<div>
								<div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
									<Bot className="size-4" />
								</div>
								<div className="grid flex-1 text-left text-lg leading-tight">
									<span className="truncate font-medium">
										bitBrief.
									</span>
								</div>
								<ThemeToggle />
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavLinks links={data.links} />
				<NavSupport items={data.navSupport} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={data.user} />
			</SidebarFooter>
		</Sidebar>
	);
}
