export type FooterLink = {
  label: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Shop",
    links: [
      { label: "New Drops" },
      { label: "Brands" },
      { label: "Sale" },
      { label: "Gift Cards" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "FAQ" },
      { label: "Shipping" },
      { label: "Returns" },
      { label: "Contact Us" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About" },
      { label: "Careers" },
      { label: "Press" },
      { label: "Privacy Policy" },
    ],
  },
];

export const footerDescription =
  "The destination for limited-release sneakers and exclusive drops.";

export const footerCopyright = "© 2026 DROPX. All rights reserved.";
