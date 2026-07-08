"use client";

import Link from "next/link";
import { trackInstantQuoteClick } from "@/helpers/instantQuoteAnalytics";

type Props = {
  href: string;
  className: string;
  buttonLabel: string;
  buttonLocation:
    | "blog_cta"
    | "home_final_cta"
    | "home_lifestyle"
    | "header_desktop"
    | "header_mobile_sticky";
  children: React.ReactNode;
};

export default function TrackedInstantQuoteLink({
  href,
  className,
  buttonLabel,
  buttonLocation,
  children,
}: Props) {
  return (
    <Link
      href={href}
      className={className}
      onClick={() =>
        trackInstantQuoteClick({
          buttonLocation,
          buttonLabel,
          destination: href,
        })
      }
    >
      {children}
    </Link>
  );
}
