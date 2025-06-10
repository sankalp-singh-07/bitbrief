'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useSignIn, useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

export function LoginForm({
	className,
	...props
}: React.ComponentProps<'form'>) {
	const { signIn, setActive, isLoaded } = useSignIn();
	const { user } = useUser();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLogging, setIsLogging] = useState(false);
	const [isGitHubLoading, setIsGitHubLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push('/dashboard');
		}
	}, [user, router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded) return;

		try {
			setError('');
			setIsLogging(true);

			if (!email || !password) {
				setError('Please enter both email and password');
				return;
			}

			const result = await signIn.create({
				identifier: email,
				password,
			});

			if (result.status === 'complete') {
				await setActive({ session: result.createdSessionId });
				router.push('/dashboard');
			} else {
				setError('Login incomplete. Please try again.');
			}
		} catch (err: any) {
			console.error('Login error:', err);

			if (err.errors && err.errors[0]) {
				const errorMsg = err.errors[0].message;
				if (errorMsg.includes('Invalid')) {
					setError(
						'Invalid email or password. Please check your credentials.'
					);
				} else if (errorMsg.includes('not found')) {
					setError(
						'No account found with this email. Please sign up first.'
					);
				} else if (errorMsg.includes('password')) {
					setError('Incorrect password. Please try again.');
				} else {
					setError(errorMsg);
				}
			} else {
				setError('Login failed. Please try again.');
			}
		} finally {
			setIsLogging(false);
		}
	};

	const handleGitHub = async () => {
		if (!isLoaded) return;

		try {
			setError('');
			setIsGitHubLoading(true);

			await signIn.authenticateWithRedirect({
				strategy: 'oauth_github',
				redirectUrl: '/sign-in',
				redirectUrlComplete: '/dashboard',
			});
		} catch (err: any) {
			console.error('GitHub login error:', err);

			if (err.errors && err.errors[0]) {
				const errorMsg = err.errors[0].message;
				if (
					errorMsg.includes('not found') ||
					errorMsg.includes('No account')
				) {
					setError(
						'No account found with this GitHub email. Please sign up first.'
					);
				} else if (errorMsg.includes('OAuth')) {
					setError('GitHub authentication failed. Please try again.');
				} else if (
					errorMsg.includes('cancelled') ||
					errorMsg.includes('denied')
				) {
					setError('GitHub login was cancelled. Please try again.');
				} else {
					setError(errorMsg);
				}
			} else {
				setError(
					'GitHub login failed. Please try again or use email login.'
				);
			}
		} finally {
			setIsGitHubLoading(false);
		}
	};

	return (
		<form
			className={cn('flex flex-col gap-6', className)}
			{...props}
			onSubmit={handleSubmit}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Login to your account</h1>
				<p className="text-muted-foreground text-sm text-balance">
					Enter your email below to login to your account
				</p>
			</div>

			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>
						{error}
						{error.includes('No account found') && (
							<div className="mt-2">
								<Link
									href="/sign-up"
									className="text-blue-500 hover:underline"
								>
									Create a new account →
								</Link>
							</div>
						)}
					</AlertDescription>
				</Alert>
			)}

			<div className="grid gap-6">
				<div className="grid gap-3">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						required
						name="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className={
							error && error.includes('email')
								? 'border-red-500'
								: ''
						}
					/>
				</div>

				<div className="grid gap-3">
					<div className="flex items-center">
						<Label htmlFor="password">Password</Label>
						<Link
							href="#"
							className="ml-auto text-sm underline-offset-4 hover:underline"
						>
							Forgot your password?
						</Link>
					</div>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							required
							name="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className={`pr-10 ${
								error && error.includes('password')
									? 'border-red-500'
									: ''
							}`}
						/>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
				</div>

				<Button type="submit" className="w-full" disabled={isLogging}>
					{isLogging ? (
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Logging in...
						</div>
					) : (
						'Login'
					)}
				</Button>

				<div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
					<span className="bg-background text-muted-foreground relative z-10 px-2">
						Or continue with
					</span>
				</div>

				<Button
					type="button"
					variant="outline"
					className="w-full"
					onClick={handleGitHub}
					disabled={isGitHubLoading}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						className="w-4 h-4 mr-2"
						fill="currentColor"
					>
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
					</svg>
					{isGitHubLoading ? (
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
							Redirecting...
						</div>
					) : (
						'Login with GitHub'
					)}
				</Button>

				<div className="text-center text-xs text-muted-foreground">
					Authentication powered by{' '}
					<Link
						href="https://clerk.com"
						className="text-blue-500 hover:underline"
					>
						Clerk
					</Link>{' '}
					- Secure & reliable user management
				</div>
			</div>

			<div className="text-center text-sm">
				Don&apos;t have an account?{' '}
				<Link href="/sign-up" className="underline underline-offset-4">
					Sign up
				</Link>
			</div>
		</form>
	);
}
