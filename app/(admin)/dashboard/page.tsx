import { ThemeToggle } from '@/components/theme-toggle';
import { SignOutButton } from '@clerk/nextjs';
import React from 'react';

const Dashboard = () => {
	return (
		<>
			<div className="bg-background text-foreground">
				<h1 className="text-primary">Hello Theme!</h1>
			</div>
			<SignOutButton />
			<ThemeToggle />
		</>
	);
};

export default Dashboard;
