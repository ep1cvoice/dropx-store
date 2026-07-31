import { Mail, MessagesSquare, Phone } from "lucide-react";

import { inter } from "@/lib/fonts";

const CONTACT_PHONE = "+48 500 284 119";
const CONTACT_EMAIL = "hello@dropx.store";

function InstagramCircleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <circle cx="14" cy="14" r="14" fill="#121212" />
      <g
        fill="none"
        stroke="#fff"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="8" y="8" width="12" height="12" rx="3.2" />
        <circle cx="14" cy="14" r="2.8" />
        <circle cx="17.8" cy="10.2" r="0.7" fill="#fff" stroke="none" />
      </g>
    </svg>
  );
}

function FacebookCircleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <circle cx="14" cy="14" r="14" fill="#121212" />
      <path
        fill="#fff"
        d="M15.6 22v-7.1h2.4l.4-2.8h-2.8v-1.8c0-.8.2-1.4 1.4-1.4h1.5V6.3c-.3 0-1.1-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.1H10v2.8h2.6V22h3z"
      />
    </svg>
  );
}

function TikTokCircleIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
      <circle cx="14" cy="14" r="14" fill="#121212" />
      <path
        fill="#fff"
        d="M17.4 7c.4 1.7 1.5 3.1 3.1 3.6v2.3c-1.1-.1-2.1-.4-3.1-1v4.7c0 3-2.4 5.4-5.4 5.4S6.6 19.6 6.6 16.6 9 11.2 12 11.2c.3 0 .6 0 .9.1v2.5c-.3-.1-.6-.2-.9-.2-1.6 0-2.9 1.3-2.9 2.9s1.3 2.9 2.9 2.9 2.9-1.3 2.9-2.9V7h2.5z"
      />
    </svg>
  );
}

const contactItems = [
  {
    label: CONTACT_PHONE,
    icon: <Phone className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />,
  },
  {
    label: CONTACT_EMAIL,
    icon: <Mail className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />,
  },
  
] as const;

const socialItems = [
  { label: "Instagram", icon: InstagramCircleIcon },
  { label: "Facebook", icon: FacebookCircleIcon },
  { label: "TikTok", icon: TikTokCircleIcon },
] as const;

export default function ContactBar() {
  return (
    <section
      aria-label="Contact"
      className={`${inter.className} bg-[#f1f1f1] text-[#121212]`}
    >
      <div className="mx-auto flex max-w-[1600px] flex-col gap-5 px-6 py-5 md:flex-row md:items-center md:justify-between md:gap-8 lg:px-10">
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 md:gap-x-12 lg:gap-x-16">
          {contactItems.map((item) => (
            <li
              key={item.label}
              className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.06em] md:text-sm"
            >
              {item.icon}
              <span>{item.label}</span>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-xs font-semibold uppercase tracking-[0.08em] md:text-sm">
            Find us:
          </span>
          <ul className="flex items-center gap-2.5">
            {socialItems.map(({ label, icon: Icon }) => (
              <li key={label} aria-label={label}>
                <Icon />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
