'use client';

import Link from 'next/link';
import { Heart, Search, ShoppingBag, User } from 'lucide-react';
import Logo from './Logo';
import Button from '../ui/Button';
import NavCountBadge from './NavCountBadge';
import { getNavLinkClassName, navIconClassName, navLinks } from './nav-links';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { useStoreBag } from '@/components/providers/StoreBagProvider';

export default function NavbarDesktop() {
	const pathname = usePathname();
	const { status } = useSession();
	const { cartCount, wishlistCount } = useStoreBag();
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
				<button type='button' aria-label='Search' className='cursor-pointer text-white/90 transition-colors hover:text-[#e85d2a]'>
					<Search className={navIconClassName} strokeWidth={1.75} />
				</button>
				<Link
					href='/account/wishlist'
					aria-label={wishlistCount > 0 ? `Wishlist, ${wishlistCount} items` : 'Wishlist'}
					className='relative cursor-pointer text-white/90 transition-colors hover:text-[#e85d2a]'
				>
					<Heart className={navIconClassName} strokeWidth={1.75} />
					<NavCountBadge count={wishlistCount} />
				</Link>
				<Link
					href='/cart'
					aria-label={cartCount > 0 ? `Cart, ${cartCount} items` : 'Cart'}
					className='relative cursor-pointer text-white/90 transition-colors hover:text-[#e85d2a]'
				>
					<ShoppingBag className={navIconClassName} strokeWidth={1.75} />
					<NavCountBadge count={cartCount} />
				</Link>

				{status === 'authenticated' ? (
					<>
						<Link href='/account' aria-label='Account' className='cursor-pointer text-white/90 transition-colors hover:text-[#e85d2a]'>
							<User className={navIconClassName} strokeWidth={1.75} />
						</Link>
						<Button
							type='button'
							onClick={() => signOut({ callbackUrl: '/' })}
							className='cursor-pointer border border-white bg-transparent text-white hover:bg-white/10 active:bg-white/20'
						>
							Log out
						</Button>
					</>
				) : (
					<Link href='/login'>
						<Button variant='accent' className='rounded-none text-white/90 transition-colors hover:text-white cursor-pointer'>
							Sign In
						</Button>
					</Link>
				)}
			</div>
		</div>
	);
}
