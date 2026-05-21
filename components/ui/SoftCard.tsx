export function SoftCard({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={`glass rounded-[1.5rem] p-5 sm:p-6 ${className}`}>{children}</section>;
}
