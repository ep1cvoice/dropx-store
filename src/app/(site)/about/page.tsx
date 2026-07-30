import type { Metadata } from "next";

import About from "./About";

export const metadata: Metadata = {
  title: "About — DROPX",
  description:
    "DROPX is a drop-focused sneaker storefront — limited releases, curated brands, and member perks.",
};

export default function AboutPage() {
  return <About />;
}
