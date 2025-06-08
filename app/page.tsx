import Header from '@/components/home-components/header';
import Hero from '@/components/home-components/hero';
import React from 'react';

const Home = () => {
	return (
		<>
			<div className="min-h-screen bg-background">
				<header className="border-b border-divider">
					<Header />
				</header>

				<main>
					<Hero />
				</main>
			</div>
		</>
	);
};

export default Home;
