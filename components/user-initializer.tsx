'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/useUserStore';

export function UserInitializer() {
	const initializeUser = useUserStore((state) => state.initializeUser);

	useEffect(() => {
		initializeUser();
	}, [initializeUser]);

	return null;
}
