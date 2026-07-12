'use client';

import Link from 'next/link';
import { Heart, Search, ShoppingBag } from 'lucide-react';
import Logo from './Logo';
import Button from '../ui/Button';
import { getNavLinkClassName, navIconClassName, navLinks } from './nav-links';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

export default function NavbarDesktop() {

	const pathname = usePathname();
	const { status } = useSession();
	const isActive = (href: string) => pathname.startsWith(href);

	return (
		<div className='flex h-[76px] mx-auto max-w-[1600px] items-center justify-between px-6 lg:px-10'>
			<div className='flex items-center gap-10'>
				<Logo />

				<nav className='flex items-center gap-8'>
					{navLinks.map(({ href, label, accent }) => (
						<Link key={href} href={href} className={getNavLinkClassName(accent, isActive(href))}>
							{label}
						</Link>
					))}
				</nav>
			</div>

			<div className='flex items-center gap-5'>
				<button type='button' aria-label='Search' className='text-white/90 transition-colors hover:text-white'>
					<Search className={navIconClassName} strokeWidth={1.75} />
				</button>
				<Link href='/wishlist' aria-label='Wishlist' className='text-white/90 transition-colors hover:text-white'>
					<Heart className={navIconClassName} strokeWidth={1.75} />
				</Link>
				<Link href='/cart' aria-label='Cart' className='text-white/90 transition-colors hover:text-white'>
					<ShoppingBag className={navIconClassName} strokeWidth={1.75} />
				</Link>

				{status === 'authenticated' ? (
					<Button
						type='button'
						onClick={() => signOut({ callbackUrl: '/' })}
						className='cursor-pointer border border-white bg-transparent text-white hover:bg-white/10 active:bg-white/20'
					>
						Log out
					</Button>
				) : (
					<Link href='/login'>
						<Button variant='accent' className='text-white/90 transition-colors hover:text-white cursor-pointer'>
							Sign Up
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
}
