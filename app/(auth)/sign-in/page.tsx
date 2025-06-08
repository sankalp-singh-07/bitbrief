import { GalleryVerticalEnd } from 'lucide-react';

import { LoginForm } from '@/components/auth-component/login.component';

export default function LoginPage() {
	return (
		<div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
			<div className="flex w-full max-w-sm flex-col gap-6">
				<div className="flex w-full max-w-sm gap-3 justify-center items-center">
					<a
						href="/"
						className="flex items-center gap-2 self-center font-medium"
					>
						bitBrief.
					</a>
					<p>|</p>
					<a className="cursor-pointer" href="/">
						Go Back To 🏠
					</a>
				</div>
				<LoginForm />
			</div>
		</div>
	);
}
