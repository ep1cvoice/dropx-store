'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { XIcon } from 'lucide-react';

/** Session stored for the promo popup. */
const PROMO_SESSION_KEY = 'dropx_promo_sb_dunk';
/** Local storage for the cookie consent. */
const COOKIE_CONSENT_KEY = 'dropx_cookie_consent';
/** Shop href for the promo popup. */
const SHOP_HREF = '/browse-all?brand=nike';

export default function PromoPopup() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		let cancelled = false;
		let retryTimer: number | undefined;
		let showTimer: number | undefined;

		function alreadySeen(): boolean {
			try {
				return window.sessionStorage.getItem(PROMO_SESSION_KEY) === '1';
			} catch {
				return false;
			}
		}

		function cookiePending(): boolean {
			try {
				return !window.localStorage.getItem(COOKIE_CONSENT_KEY);
			} catch {
				return false;
			}
		}

		function open() {
			if (cancelled || alreadySeen()) return;
			setVisible(true);
		}

		if (alreadySeen()) return;

		// Wait for cookie banner first so two overlays don't fight.
		// Cap wait so a stuck cookie dialog never blocks the promo forever.
		const started = Date.now();
		const MAX_WAIT_MS = 5000;

		function tryWhenReady() {
			if (cancelled || alreadySeen()) return;

			if (cookiePending() && Date.now() - started < MAX_WAIT_MS) {
				retryTimer = window.setTimeout(tryWhenReady, 350);
				return;
			}

			showTimer = window.setTimeout(open, 450);
		}

		tryWhenReady();

		return () => {
			cancelled = true;
			if (retryTimer != null) window.clearTimeout(retryTimer);
			if (showTimer != null) window.clearTimeout(showTimer);
		};
	}, []);

	useEffect(() => {
		if (!visible) return;

		const previousOverflow = document.body.style.overflow;
		document.body.style.overflow = 'hidden';

		function onKeyDown(event: KeyboardEvent) {
			if (event.key === 'Escape') dismiss();
		}

		window.addEventListener('keydown', onKeyDown);
		return () => {
			document.body.style.overflow = previousOverflow;
			window.removeEventListener('keydown', onKeyDown);
		};
	}, [visible]);

	function dismiss() {
		try {
			window.sessionStorage.setItem(PROMO_SESSION_KEY, '1');
		} catch {}
		setVisible(false);
	}

	if (!visible) return null;

	return (
		<div className='fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6'>
			<button
				type='button'
				aria-label='Dismiss promotion'
				onClick={dismiss}
				className='absolute inset-0 cursor-pointer bg-black/70'
			/>

			<div
				role='dialog'
				aria-modal='true'
				aria-labelledby='promo-popup-title'
				className='relative z-10 w-full max-w-[520px] bg-[#f4f1ec] shadow-[0_24px_80px_rgba(0,0,0,0.35)]'>
				<button
					type='button'
					onClick={dismiss}
					aria-label='Close'
					className='absolute right-2 top-2 z-20 flex h-9 w-9 cursor-pointer items-center justify-center bg-black/80 text-white transition-colors hover:bg-black'>
					<XIcon className='h-4 w-4' strokeWidth={2.2} />
				</button>

				<h2 id='promo-popup-title' className='sr-only'>
					Nike SB Dunk — limited colorways
				</h2>

				<Link
					href={SHOP_HREF}
					onClick={dismiss}
					className='relative block cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#121212] focus-visible:ring-offset-2'>
					<Image
						src='/nike-sb-dunk-limited.jpeg'
						alt='Nike SB Dunk limited colorways — shop now'
						width={1040}
						height={1040}
						priority
						className='h-auto w-full'
						sizes='(max-width: 560px) 92vw, 520px'
					/>
				</Link>
			</div>
		</div>
	);
}
