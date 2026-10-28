import type { ReactNode } from "react";
import { MobileAppBar } from "./MobileAppBar";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

/**
 * Layout for inner pages: desktop nav (md+), mobile app bar (below md), page content, optional footer.
 * Pass `appBar={null}` for pages whose mobile design has no app bar (they render their own top).
 */
export function PageShell({
  title,
  backHref,
  appBarActions,
  appBar,
  footer = false,
  children,
}: {
  title: string;
  backHref?: string;
  appBarActions?: ReactNode;
  appBar?: ReactNode | null;
  footer?: boolean;
  children: ReactNode;
}) {
  return (
    <>
      <div className="hidden md:block">
        <SiteHeader />
      </div>
      {appBar === undefined ? <MobileAppBar title={title} backHref={backHref} actions={appBarActions} /> : appBar}
      <main>{children}</main>
      {footer && <SiteFooter />}
    </>
  );
}
