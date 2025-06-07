import { ThemeToggle } from '@/components/theme-toggle';
import React from 'react';

const Dashboard = () => {
	return (
		<>
			<div className="bg-background text-foreground">
				<h1 className="text-primary">Hello Theme!</h1>
			</div>
			<ThemeToggle />
		</>
	);
};

export default Dashboard;
