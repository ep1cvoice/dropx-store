export type FooterLink = {
  label: string;
  href?: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "New Drops", href: "/browse-all?collection=new-drops" },
      { label: "Brands", href: "/browse-all" },
      { label: "Sale", href: "/browse-all?collection=sale" },
      { label: "Gift Cards" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ" },
      { label: "Shipping" },
      { label: "Returns" },
      { label: "Contact Us", href: "mailto:hello@dropx.store" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Careers" },
      { label: "Press" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

export const footerDescription =
  "The destination for limited-release sneakers and exclusive drops.";

export const footerCopyright = "© 2026 DROPX. All rights reserved.";
