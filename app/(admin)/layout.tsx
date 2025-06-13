import { AppSidebar } from '@/components/sidebar-components/app-sidebar';

import { SiteHeader } from '@/components/sidebar-components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const { userId } = await auth();
	if (!userId) redirect('/sign-in');
	else if (userId) {
		const client = await clerkClient();
		const user = await client.users.getUser(userId);
		const role = user.publicMetadata?.role;
		if (!role) {
			await client.users.updateUserMetadata(userId, {
				publicMetadata: { role: 'free' },
			});
		}
	}
	return (
		<div className="[--header-height:calc(--spacing(14))]">
			<SidebarProvider className="flex flex-col">
				<SiteHeader />
				<div className="flex flex-1">
					<AppSidebar />
					<SidebarInset className="flex-1">
						<main className="flex flex-1 flex-col">{children}</main>
					</SidebarInset>
				</div>
			</SidebarProvider>
		</div>
	);
};

export default AdminLayout;
