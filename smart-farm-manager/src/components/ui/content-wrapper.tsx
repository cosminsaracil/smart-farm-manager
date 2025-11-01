import React from "react";

import { cn } from "@/lib/utils";

const ContentWrapper = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("flex flex-col gap-8", className)} {...props}>
      {children}
    </div>
  );
});

ContentWrapper.displayName = "ContentWrapper";
export default ContentWrapper;
