import { z } from 'zod';

export const signUpSchema = z
	.object({
		username: z
			.string()
			.min(3, 'Username must be at least 3 characters')
			.max(20, 'Username must be less than 20 characters')
			.regex(
				/^[a-zA-Z0-9_]+$/,
				'Username can only contain letters, numbers, and underscores'
			),
		email: z.string().email('Please enter a valid email address'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.regex(
				/[A-Z]/,
				'Password must contain at least one uppercase letter'
			)
			.regex(
				/[a-z]/,
				'Password must contain at least one lowercase letter'
			)
			.regex(/[0-9]/, 'Password must contain at least one number')
			.regex(
				/[^A-Za-z0-9]/,
				'Password must contain at least one special character'
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Password don't match",
		path: ['confirmPassword'],
	});

export type signUpSchemaType = z.infer<typeof signUpSchema>;
