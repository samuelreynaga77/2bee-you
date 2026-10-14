import { cn } from "@/lib/cn";

export function PrimaryButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-control bg-honey-deep px-5 text-base font-semibold text-foam transition-colors duration-150 hover:bg-ink disabled:opacity-40",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function GhostButton({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-control border border-line bg-card px-5 text-base font-semibold text-ink",
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Chip({
  selected,
  children,
  onClick,
}: {
  selected?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        "min-h-11 rounded-control border px-4 py-2 text-left text-sm font-semibold transition-colors duration-150",
        selected ? "border-honey-deep bg-honey-deep text-foam" : "border-line bg-card text-ink",
      )}
    >
      {children}
    </button>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold">{label}</span>
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

export const fieldClass =
  "min-h-12 w-full rounded-control border border-line bg-card px-4 text-base text-ink outline-none placeholder:text-faint";
