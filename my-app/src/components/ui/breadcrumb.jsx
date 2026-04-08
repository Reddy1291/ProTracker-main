import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

// Assuming 'cn' is a utility function like 'clsx' or 'classnames' for merging Tailwind classes
// If you don't have this, you'll need to define it or replace it with direct string concatenation.
// For now, we'll keep the import, assuming './utils' exists.
import { cn } from "./utils";

/**
 * ## 🍞 Breadcrumb Component
 * The main container for the breadcrumb navigation.
 */
// Original: function Breadcrumb({ ...props }: React.ComponentProps<"nav">) {
function Breadcrumb(props) {
  return <nav aria-label="breadcrumb" data-slot="breadcrumb" {...props} />;
}

//---

/**
 * ## 📜 BreadcrumbList Component
 * The ordered list containing the breadcrumb items.
 */
// Original: function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
function BreadcrumbList({ className, ...props }) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5",
        className,
      )}
      {...props}
    />
  );
}

//---

/**
 * ## 📌 BreadcrumbItem Component
 * A single item within the breadcrumb list.
 */
// Original: function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
function BreadcrumbItem({ className, ...props }) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("inline-flex items-center gap-1.5", className)}
      {...props}
    />
  );
}

//---

/**
 * ## 🔗 BreadcrumbLink Component
 * A clickable link within the breadcrumb, using Radix Slot for flexibility.
 */
// Original: function BreadcrumbLink({ asChild, className, ...props }: React.ComponentProps<"a"> & { asChild?: boolean; }) {
function BreadcrumbLink({
  asChild,
  className,
  ...props
}) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn("hover:text-foreground transition-colors", className)}
      {...props}
    />
  );
}

//---

/**
 * ## 🏠 BreadcrumbPage Component
 * The current, non-clickable page in the breadcrumb path.
 */
// Original: function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
function BreadcrumbPage({ className, ...props }) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn("text-foreground font-normal", className)}
      {...props}
    />
  );
}

//---

/**
 * ## / BreadcrumbSeparator Component
 * The visual divider between breadcrumb items (defaults to ChevronRight).
 */
// Original: function BreadcrumbSeparator({ children, className, ...props }: React.ComponentProps<"li">) {
function BreadcrumbSeparator({
  children,
  className,
  ...props
}) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("[&>svg]:size-3.5", className)}
      {...props}
    >
      {children ?? <ChevronRight />}
    </li>
  );
}

//---

/**
 * ## ... BreadcrumbEllipsis Component
 * Represents collapsed or hidden breadcrumb items.
 */
// Original: function BreadcrumbEllipsis({ className, ...props }: React.ComponentProps<"span">) {
function BreadcrumbEllipsis({
  className,
  ...props
}) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">More</span>
    </span>
  );
}

//---

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};