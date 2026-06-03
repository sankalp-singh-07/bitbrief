import { AppSidebar } from '@/components/sidebar-components/app-sidebar';

import { SiteHeader } from '@/components/sidebar-components/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';
import { syncUser } from '@/app/actions/user.actions';
import { UserInitializer } from '@/components/user-initializer';

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
	const { userId } = await auth();
	if (!userId) redirect('/sign-in');
	else if (userId) {
		const client = await clerkClient();
		const user = await client.users.getUser(userId);
		
		// Ensure Mongoose Document exists
		try {
			await syncUser();
		} catch (error) {
			console.error('Failed to sync to MongoDB on layout load', error);
		}

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
				<UserInitializer />
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
