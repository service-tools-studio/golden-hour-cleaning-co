"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { onSamePageFooterClick } from "@/helpers/footerSamePageScroll";

type Props = {
  href: string;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
};

export default function FooterNavLink({
  href,
  className,
  children,
  onNavigate,
}: Props) {
  const pathname = usePathname();

  return (
    <Link
      href={href}
      className={className}
      onClick={(e) => onSamePageFooterClick(e, href, pathname, onNavigate)}
    >
      {children}
    </Link>
  );
}