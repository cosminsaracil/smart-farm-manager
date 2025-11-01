"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/utils/routes";
import { Home, Users2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { text: "Home", icon: Home, href: ROUTES.HOME },
    { text: "Farmers", icon: Users2, href: ROUTES.FARMERS },
  ];

  return (
    <div className="flex flex-col h-full">
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.text}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all shadow-shadow",
                isActive
                  ? "bg-main text-main-foreground"
                  : "text-foreground hover:bg-background hover:translate-x-1"
              )}
            >
              <Icon className="w-5 h-5" />
              <span>{item.text}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
