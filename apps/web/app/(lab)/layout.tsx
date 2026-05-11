/**
 * Route-group layout for the lab pages (/viem, /ethers, /compare).
 * Currently a pass-through; here so all three routes can grow shared chrome
 * (breadcrumbs, lab-only nav, etc.) without touching the root layout.
 */
export default function LabLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
