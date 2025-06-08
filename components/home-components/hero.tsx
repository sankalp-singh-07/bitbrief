'use client';
import React from 'react';
import { Input } from '../ui/input';
import { Mail } from 'lucide-react';
import { Button } from '../ui/button';
import { MarqueeDemo } from './marquee';
import { OrbitingCirclesDemo } from './orbit';

const Hero = () => {
	return (
		<div className="px-4 md:px-8 lg:px-16 max-w-7xl mx-auto">
			<div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-16 lg:items-center min-h-[80vh] pt-8 lg:pt-16 pb-2 lg:pb-16">
				<div className="order-1 lg:order-2">
					<OrbitingCirclesDemo />
				</div>

				<div className="order-2 lg:order-1 text-center lg:text-left space-y-6 lg:space-y-8">
					<div className="space-y-2 lg:space-y-4">
						<h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-tight">
							Signal.{' '}
							<span className="text-primary">Summary.</span>{' '}
							Strategy.
						</h1>
					</div>

					<div className="space-y-4 lg:space-y-6">
						<p className="text-sm sm:text-base md:text-lg lg:text-xl font-light tracking-wide uppercase text-foreground inline-block">
							Turn market chaos into readable reports with one
							click.
						</p>

						<div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto lg:mx-0">
							<div className="relative flex-1">
								<Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground z-10 w-4 h-4 md:w-5 md:h-5" />
								<Input
									type="email"
									placeholder="Enter your email"
									className="pl-10 md:pl-12 pr-3 py-2 md:py-3 text-sm md:text-base h-10 md:h-12 w-full border-2 border-primary"
								/>
							</div>
							<Button
								size="default"
								className="font-normal text-sm md:text-lg cursor-pointer bg-primary h-10 md:h-12 px-4 md:px-6 whitespace-nowrap text-background dark:text-border"
							>
								Get Started
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div className="mt-0 lg:mt-10 overflow-hidden">
				<div className="marquee-container mb-6">
					<MarqueeDemo />
				</div>
			</div>
		</div>
	);
};

export default Hero;
