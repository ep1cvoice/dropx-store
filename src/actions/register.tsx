'use server';

import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { registerSchema, type RegisterFormValues } from '@/lib/validation';
import { saltAndHashPassword } from '@/utils/password';

export async function register(data: RegisterFormValues): Promise<{ error: string } | never> {
	const parsed = registerSchema.safeParse(data);
	if (!parsed.success) {
		return { error: 'Invalid form data.' };
	}

	const { firstName, lastName, email, password } = parsed.data;

	const existing = await prisma.user.findUnique({ where: { email } });
	if (existing) {
		return { error: 'An account with that email already exists.' };
	}

	const hashedPassword = await saltAndHashPassword(password);

	try {
		await prisma.user.create({
			data: {
				email,
				name: firstName,
				lastName,
				password: hashedPassword,
			},
		});
	} catch (error) {
		console.error(error);
		return { error: 'An error occurred while registering the user.' };
	}

	redirect('/login');
}
