import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { anton, inter } from '@/lib/fonts';
import Link from 'next/link';

const countdownItems = [
	{ value: '02', label: 'Days' },
	{ value: '14', label: 'Hrs' },
	{ value: '37', label: 'Min' },
	{ value: '52', label: 'Sec' },
];

export default function HomeHeroDesktop() {
	return (
		<>
			<section className='relative min-h-[58vh] w-full overflow-hidden bg-[#07090c] md:hidden'>
				<Image
					src='/homeHeroWP.webp'
					alt='Limited sneaker drop hero'
					fill
					priority
					quality={85}
					className='pointer-events-none object-cover object-[48%_center]'
					sizes='100vw'
				/>

				<div className='pointer-events-none absolute inset-0 bg-[#06080b]/28' />
				<div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-black/62 via-black/26 to-black/30' />

				<div className='absolute right-4 top-4 z-10 text-right'>
					<p className={`${inter.className} text-[8px] font-medium uppercase tracking-[0.18em] text-[#e85d2a]`}>
						Next Drop In
					</p>
					<div className='mt-1 flex items-end gap-1.5'>
						{countdownItems.map((item, index) => (
							<div key={`mobile-${item.label}`} className='flex items-end gap-1.5'>
								<span className={`${anton.className} text-[24px] leading-none text-white`}>{item.value}</span>
								{index !== countdownItems.length - 1 && (
									<span className={`${anton.className} text-[20px] leading-none text-white/80`}>:</span>
								)}
							</div>
						))}
					</div>
				</div>

				<div className='relative z-10 mx-auto flex min-h-[58vh] w-full max-w-[1600px] flex-col justify-end px-4 pb-5 pt-8'>
					<p className={`${inter.className} text-[10px] font-medium uppercase tracking-[0.22em] text-[#e85d2a]`}>
						Exclusive Drop - Summer 2026
					</p>

					<h1
						className={`${anton.className} mt-3 max-w-[260px] text-[78px] uppercase leading-[0.88] tracking-[0.01em] text-white`}>
						Limited.
						<br />
						Exclusive.
						<br />
						Yours.
					</h1>

					<Link
						href='/browse-all'
						className={`${inter.className} relative z-20 mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-none bg-[#e85d2a] px-8 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#f06d3a] active:bg-[#d45220]`}>
						<ArrowRight className='h-4 w-4' strokeWidth={2.1} />
						Shop the drop
					</Link>
				</div>
			</section>

			<section className='relative hidden min-h-[56vh] w-full overflow-hidden bg-[#07090c] md:block lg:min-h-[50vh]'>
				<Image
					src='/homeHeroWP.webp'
					alt='Limited sneaker drop hero'
					fill
					priority
					quality={85}
					className='pointer-events-none object-cover object-center'
					sizes='(min-width: 1536px) 1536px, (min-width: 1280px) 1280px, (min-width: 1024px) 1024px, 100vw'
				/>

				<div className='pointer-events-none absolute inset-0 bg-[#06080b]/20' />
				<div className='pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/18 to-black/35' />

				<div className='relative z-10 mx-auto flex min-h-[56vh] w-full max-w-[1600px] flex-col justify-between px-6 py-8 md:px-8 md:py-10 lg:min-h-[50vh] lg:px-10 lg:py-14 xl:px-14'>
					<div>
						<p
							className={`${inter.className} text-[10px] font-medium uppercase tracking-[0.24em] text-[#e85d2a] md:text-xs md:tracking-[0.28em]`}>
							Exclusive Drop - Summer 2026
						</p>

						<h1
							className={`${anton.className} mt-5 max-w-[420px] text-[64px] uppercase leading-[0.88] tracking-[0.012em] text-white md:mt-6 md:max-w-[480px] md:text-[76px] lg:mt-8 lg:max-w-[520px] lg:text-[92px] xl:text-[108px]`}>
							Limited.
							<br />
							Exclusive.
							<br />
							Yours.
						</h1>

						<Link
							href='/browse-all'
							className={`${inter.className} relative z-20 mt-6 inline-flex cursor-pointer items-center justify-center gap-2 rounded-none bg-[#e85d2a] px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#f06d3a] active:bg-[#d45220] md:mt-7 md:px-8 md:py-3.5 lg:mt-10 lg:px-10 lg:py-4 lg:text-base lg:tracking-[0.18em]`}>
							Shop The Drop
							<ArrowRight className='h-4 w-4' strokeWidth={2.1} />
						</Link>
					</div>

					<div className='ml-auto text-right'>
						<p
							className={`${inter.className} text-[9px] font-medium uppercase tracking-[0.22em] text-[#e85d2a] md:text-[10px] md:tracking-[0.24em] lg:text-[11px] lg:tracking-[0.28em]`}>
							Next Drop In
						</p>

						<div className='mt-2 flex items-end gap-2.5 md:mt-3 md:gap-3 lg:gap-4'>
							{countdownItems.map((item, index) => (
								<div key={item.label} className='flex items-end gap-2.5 md:gap-3 lg:gap-4'>
									<div className='text-center'>
										<span
											className={`${anton.className} block text-[34px] leading-none text-white md:text-[40px] lg:text-[48px]`}>
											{item.value}
										</span>
										<span
											className={`${inter.className} mt-1 block text-[8px] uppercase tracking-[0.14em] text-white/60 md:text-[9px] md:tracking-[0.16em] lg:text-[10px] lg:tracking-[0.2em]`}>
											{item.label}
										</span>
									</div>
									{index !== countdownItems.length - 1 && (
										<span
											className={`${anton.className} mb-1 text-[26px] leading-none text-white/80 md:mb-1.5 md:text-[32px] lg:mb-2 lg:text-[38px]`}>
											:
										</span>
									)}
								</div>
							))}
						</div>
					</div>
				</div>
			</section>
		</>
	);
}
