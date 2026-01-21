import { clsx } from "clsx";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  glow?: boolean;
}

export function Card({ children, className, title, glow = false }: CardProps) {
  return (
    <div
      className={clsx(
        "glass rounded-2xl p-6 relative overflow-hidden transition-all duration-300",
        glow && "hover:shadow-[0_0_30px_-5px_rgba(var(--primary),0.3)] hover:border-primary/50",
        className
      )}
    >
      {glow && (
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 blur-[80px] rounded-full pointer-events-none" />
      )}
      
      {title && (
        <h3 className="text-lg font-display font-semibold text-white/90 mb-4 flex items-center gap-2">
          {title}
        </h3>
      )}
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}
