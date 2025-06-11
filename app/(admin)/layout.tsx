import SidebarComp from '@/components/sidebar-components/sidebarComp';
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
		<>
			<SidebarComp />
			{children}
		</>
	);
};

export default AdminLayout;
