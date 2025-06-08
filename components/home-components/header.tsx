import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import { ThemeToggle } from '../theme-toggle';
import Link from 'next/link';

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
					<Link
						href="/sign-in"
						className="font-medium text-sm md:text-lg cursor-pointer"
					>
						Log In
					</Link>
					<Button
						size="default"
						className="font-medium text-sm md:text-lg cursor-pointer bg-primary rounded-full text-background dark:text-border md:size-lg"
					>
						<Link href="/sign-up" className="hidden sm:inline">
							Get Started
						</Link>
						<Link href="/sign-up" className="sm:hidden">
							Sign In
						</Link>
						<ArrowRight className="ml-1 w-4 h-4 hidden sm:inline" />
					</Button>
				</div>
			</div>
		</>
	);
};

export default Header;
