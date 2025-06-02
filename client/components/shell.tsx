import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ShellProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Shell({ children, className, ...props }: ShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className={cn("flex-1", className)} {...props}>
        {children}
      </main>
      <footer className="border-t py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} EngBot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
