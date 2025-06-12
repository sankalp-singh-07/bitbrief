import { useUser } from '@clerk/nextjs';

export interface UserData {
	userId: string;
	userImg: string;
	userName: string;
	userUserName: string;
	userEmail: string;
}

export function useUserData(): UserData {
	const { user } = useUser();

	return {
		userId: user?.id || '',
		userImg: user?.imageUrl || '',
		userName: user?.fullName || '',
		userUserName: user?.username || '',
		userEmail: user?.emailAddresses[0]?.emailAddress || '',
	};
}
