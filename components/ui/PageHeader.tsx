export function PageHeader({
  eyebrow,
  title,
  children
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-6 pt-4 sm:pt-8">
      {eyebrow && <p className="mb-2 text-sm uppercase tracking-[0.24em] text-plum/70">{eyebrow}</p>}
      <h1 className="font-display text-4xl leading-tight text-ink sm:text-6xl">{title}</h1>
      {children && <div className="mt-3 max-w-2xl text-base leading-7 text-ink/68">{children}</div>}
    </header>
  );
}
