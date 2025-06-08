import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';

const Header = () => {
	return (
		<>
			<div className="flex justify-between items-center px-4 md:px-8 lg:px-16 py-4 max-w-7xl mx-auto">
				<div>
					<h1 className="font-semibold text-2xl md:text-3xl">
						bitBrief<span className="text-primary">.</span>
					</h1>
				</div>
				<div className="flex justify-between items-center gap-3 md:gap-4">
					<ThemeToggle />
					<h3 className="font-normal text-sm md:text-lg">Log In</h3>
					<Button
						size="default"
						className="font-normal text-sm md:text-lg cursor-pointer bg-primary rounded-full text-background dark:text-border md:size-lg"
					>
						<span className="hidden sm:inline">Get Started</span>
						<span className="sm:hidden">Sign In</span>
						<ArrowRight className="ml-1 w-4 h-4 hidden sm:inline" />
					</Button>
				</div>
			</div>
		</>
	);
};

export default Header;
