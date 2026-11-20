/** If `href` is the same page as `pathname`, scroll to top instead of navigating. */
export function onSamePageFooterClick(
  event: { preventDefault: () => void },
  href: string,
  pathname: string | null,
  after?: () => void,
): void {
  const targetPath = href.split("?")[0].split("#")[0] || "/";
  const currentPath = !pathname || pathname === "" ? "/" : pathname;

  if (targetPath === currentPath) {
    event.preventDefault();
    after?.();
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  after?.();
}