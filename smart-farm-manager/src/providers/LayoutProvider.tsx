"use client";
import { ReactNode } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTheme } from "./ThemeProvider";
import dayjs from "dayjs";
import Sidebar from "./Sidebar";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/utils/routes";

export default function LayoutProvider({ children }: { children: ReactNode }) {
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const currentDate = dayjs().format("YYYY-MM-DD");

  let title = "";
  switch (pathname) {
    case ROUTES.HOME:
      title = "Dashboard";
      break;
    case ROUTES.FARMERS:
      title = "Farmers Management";
      break;
    default:
      title = "";
      break;
  }

  return (
    <div
      className={cn(
        "min-h-screen flex flex-col bg-background text-foreground transition-colors"
      )}
    >
      {/* ✅ Topbar full width */}
      <header
        className={cn(
          "w-full border-b shadow-shadow z-20 bg-secondary-background border-border"
        )}
      >
        <div className="mx-auto w-full max-w-[70%] flex justify-between items-center py-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="App Logo"
              width={40}
              height={40}
              className="rounded-md "
            />
            <h1 className="text-2xl font-bold">{title}</h1>
          </div>

          {/* Right section: date + theme toggle */}
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground/70">{currentDate}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="border-border hover:bg-background"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* ✅ Sidebar + Content Area */}
      <div className="flex flex-1 min-h-0">
        <aside className="w-60 shrink-0 border-r border-border bg-secondary-background">
          <Sidebar />
        </aside>

        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
