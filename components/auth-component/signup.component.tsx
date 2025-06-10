'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSignUp, useUser } from '@clerk/nextjs';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, signUpSchemaType } from '@/schema/signUp.schema';

export function SignupForm({
	className,
	...props
}: React.ComponentProps<'form'>) {
	const { signUp, setActive, isLoaded } = useSignUp();
	const { user } = useUser();
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isGitHubLoading, setIsGitHubLoading] = useState(false);
	const [isVerifying, setIsVerifying] = useState(false);
	const [error, setError] = useState('');
	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState('');
	const router = useRouter();

	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isSubmitting },
	} = useForm<signUpSchemaType>({
		resolver: zodResolver(signUpSchema),
		mode: 'onChange',
	});

	const watchedPassword = watch('password');
	const watchedEmail = watch('email');

	useEffect(() => {
		if (user) {
			router.push('/dashboard');
		}
	}, [user, router]);

	const getPasswordStrength = (password: string) => {
		if (!password) return { score: 0, text: '', color: '' };

		let score = 0;
		if (password.length >= 8) score++;
		if (/[A-Z]/.test(password)) score++;
		if (/[a-z]/.test(password)) score++;
		if (/[0-9]/.test(password)) score++;
		if (/[^A-Za-z0-9]/.test(password)) score++;

		if (score <= 2) return { score, text: 'Weak', color: 'text-red-500' };
		if (score <= 3)
			return { score, text: 'Fair', color: 'text-yellow-500' };
		if (score <= 4) return { score, text: 'Good', color: 'text-blue-500' };
		return { score, text: 'Strong', color: 'text-green-500' };
	};

	const passwordStrength = useMemo(() => {
		return getPasswordStrength(watchedPassword || '');
	}, [watchedPassword]);

	const onSubmit = async (data: signUpSchemaType) => {
		if (!isLoaded) return;

		try {
			setError('');
			setIsLoading(true);

			if (!data.username || !data.email || !data.password) {
				setError('Please fill in all required fields');
				return;
			}

			if (data.password !== data.confirmPassword) {
				setError('Passwords do not match');
				return;
			}

			await signUp.create({
				username: data.username,
				emailAddress: data.email,
				password: data.password,
			});

			await signUp.prepareEmailAddressVerification({
				strategy: 'email_code',
			});
			setPendingVerification(true);
		} catch (err: any) {
			console.error('Signup error:', err);

			if (err.errors && err.errors[0]) {
				const errorMsg = err.errors[0].message;
				if (errorMsg.includes('already exists')) {
					setError(
						'An account with this email already exists. Try signing in instead.'
					);
				} else if (errorMsg.includes('username')) {
					setError(
						'This username is already taken. Please choose another.'
					);
				} else {
					setError(errorMsg);
				}
			} else {
				setError('Failed to create account. Please try again.');
			}
		} finally {
			setIsLoading(false);
		}
	};

	const onPressVerify = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!isLoaded || !code) return;

		try {
			setError('');
			setIsVerifying(true);

			const completeSignUp = await signUp.attemptEmailAddressVerification(
				{
					code,
				}
			);

			if (completeSignUp.status === 'complete') {
				await setActive({ session: completeSignUp.createdSessionId });
				router.push('/dashboard');
			} else {
				setError('Verification incomplete. Please try again.');
			}
		} catch (err: any) {
			console.error('Verification error:', err);

			if (err.errors && err.errors[0]) {
				const errorMsg = err.errors[0].message;
				if (errorMsg.includes('invalid')) {
					setError(
						'Invalid verification code. Please check and try again.'
					);
				} else if (errorMsg.includes('expired')) {
					setError(
						'Verification code has expired. Please request a new one.'
					);
				} else {
					setError(errorMsg);
				}
			} else {
				setError('Verification failed. Please try again.');
			}
		} finally {
			setIsVerifying(false);
		}
	};

	const handleGitHub = async () => {
		if (!isLoaded) return;

		try {
			setError('');
			setIsGitHubLoading(true);

			await signUp.authenticateWithRedirect({
				strategy: 'oauth_github',
				redirectUrl: '/sign-up',
				redirectUrlComplete: '/dashboard',
			});
		} catch (err: any) {
			console.error('GitHub signup error:', err);

			if (err.errors && err.errors[0]) {
				const errorMsg = err.errors[0].message;
				if (errorMsg.includes('OAuth')) {
					setError('GitHub authentication failed. Please try again.');
				} else if (errorMsg.includes('exists')) {
					setError(
						'An account with this GitHub email already exists. Try signing in instead.'
					);
				} else {
					setError(errorMsg);
				}
			} else {
				setError(
					'GitHub signup failed. Please try again or use email signup.'
				);
			}
		} finally {
			setIsGitHubLoading(false);
		}
	};

	if (pendingVerification) {
		return (
			<form
				className={cn('flex flex-col gap-6', className)}
				onSubmit={onPressVerify}
			>
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="text-2xl font-bold">Verify your email</h1>
					<p className="text-muted-foreground text-sm text-balance">
						Enter the verification code sent to your email
					</p>
				</div>
				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				)}
				<div className="grid gap-3">
					<Label htmlFor="code">Verification Code</Label>
					<Input
						id="code"
						value={code}
						onChange={(e) => setCode(e.target.value)}
						placeholder="Enter 6-digit code"
						required
						disabled={isVerifying}
						maxLength={6}
					/>
				</div>
				<Button
					type="submit"
					className="w-full"
					disabled={isVerifying || !code}
				>
					{isVerifying ? (
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Verifying...
						</div>
					) : (
						'Verify Email'
					)}
				</Button>
				<div className="text-center text-sm">
					<button
						type="button"
						onClick={() => setPendingVerification(false)}
						className="text-primary hover:underline"
					>
						← Back to signup
					</button>
				</div>
				<div id="clerk-captcha"></div>
			</form>
		);
	}

	return (
		<form
			className={cn('flex flex-col gap-6', className)}
			{...props}
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="text-2xl font-bold">Sign Up Today!</h1>
				<p className="text-muted-foreground text-sm text-balance">
					Enter details to create your account
				</p>
			</div>

			{error && (
				<Alert variant="destructive">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="grid gap-6">
				<div className="grid gap-3">
					<Label htmlFor="username">Username</Label>
					<Input
						id="username"
						type="text"
						placeholder="johndoe"
						{...register('username')}
						className={errors.username ? 'border-red-500' : ''}
					/>
					{errors.username && (
						<p className="text-sm text-red-500 flex items-center gap-1">
							<XCircle className="h-3 w-3" />
							{errors.username.message}
						</p>
					)}
				</div>

				<div className="grid gap-3">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						{...register('email')}
						className={
							errors.email
								? 'border-red-500'
								: watchedEmail && !errors.email
								? 'border-green-500'
								: ''
						}
					/>
					{errors.email && (
						<p className="text-sm text-red-500 flex items-center gap-1">
							<XCircle className="h-3 w-3" />
							{errors.email.message}
						</p>
					)}
					{watchedEmail && !errors.email && (
						<p className="text-sm text-green-500 flex items-center gap-1">
							<CheckCircle className="h-3 w-3" />
							Valid email address
						</p>
					)}
				</div>

				<div className="grid gap-3">
					<Label htmlFor="password">Password</Label>
					<div className="relative">
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							{...register('password')}
							className={`pr-10 ${
								errors.password ? 'border-red-500' : ''
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

					{watchedPassword && (
						<div className="space-y-2">
							<div className="flex items-center gap-2">
								<div className="flex-1 bg-gray-200 rounded-full h-2">
									<div
										className={`h-2 rounded-full transition-all ${
											passwordStrength.score <= 2
												? 'bg-red-500'
												: passwordStrength.score <= 3
												? 'bg-yellow-500'
												: passwordStrength.score <= 4
												? 'bg-blue-500'
												: 'bg-green-500'
										}`}
										style={{
											width: `${
												(passwordStrength.score / 5) *
												100
											}%`,
										}}
									/>
								</div>
								<span
									className={`text-sm ${passwordStrength.color}`}
								>
									{passwordStrength.text}
								</span>
							</div>

							<div className="space-y-1">
								{[
									{
										test: (p: string) => p.length >= 8,
										text: 'At least 8 characters',
									},
									{
										test: (p: string) => /[A-Z]/.test(p),
										text: 'One uppercase letter',
									},
									{
										test: (p: string) => /[a-z]/.test(p),
										text: 'One lowercase letter',
									},
									{
										test: (p: string) => /[0-9]/.test(p),
										text: 'One number',
									},
									{
										test: (p: string) =>
											/[^A-Za-z0-9]/.test(p),
										text: 'One special character',
									},
								].map((requirement, index) => (
									<div
										key={index}
										className="flex items-center gap-2 text-xs"
									>
										{requirement.test(watchedPassword) ? (
											<CheckCircle className="h-3 w-3 text-green-500" />
										) : (
											<XCircle className="h-3 w-3 text-red-500" />
										)}
										<span
											className={
												requirement.test(
													watchedPassword
												)
													? 'text-green-500'
													: 'text-red-500'
											}
										>
											{requirement.text}
										</span>
									</div>
								))}
							</div>
						</div>
					)}

					{errors.password && (
						<p className="text-sm text-red-500 flex items-center gap-1">
							<XCircle className="h-3 w-3" />
							{errors.password.message}
						</p>
					)}
				</div>

				<div className="grid gap-3">
					<Label htmlFor="confirmPassword">Confirm Password</Label>
					<div className="relative">
						<Input
							id="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							{...register('confirmPassword')}
							className={`pr-10 ${
								errors.confirmPassword ? 'border-red-500' : ''
							}`}
						/>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
							onClick={() =>
								setShowConfirmPassword(!showConfirmPassword)
							}
						>
							{showConfirmPassword ? (
								<EyeOff className="h-4 w-4" />
							) : (
								<Eye className="h-4 w-4" />
							)}
						</Button>
					</div>
					{errors.confirmPassword && (
						<p className="text-sm text-red-500 flex items-center gap-1">
							<XCircle className="h-3 w-3" />
							{errors.confirmPassword.message}
						</p>
					)}
				</div>

				<Button
					type="submit"
					className="w-full"
					disabled={isLoading || isSubmitting}
				>
					{isLoading ? (
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
							Creating Account...
						</div>
					) : (
						'Sign Up'
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
						<path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
					</svg>
					{isGitHubLoading ? (
						<div className="flex items-center gap-2">
							<div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
							Redirecting...
						</div>
					) : (
						'Sign Up with GitHub'
					)}
				</Button>

				<div className="text-center text-xs text-muted-foreground">
					GitHub signup will use your GitHub username automatically
				</div>

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
				Already have an account?{' '}
				<Link href="/sign-in" className="underline underline-offset-4">
					Sign in
				</Link>
			</div>

			<div id="clerk-captcha"></div>
		</form>
	);
}
