import * as React from "react";
import { cn } from "./utils";

// --- Card Components ---

function Card({ className, ...props }) {
  return (
    <div
      data-slot="card"
      className={cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border",
        className,
      )}
      {...props}
    />
  );
}

//---

/**
 * ## ⬆️ CardHeader
 * Container for the title, description, and action elements.
 */
// Original: function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
function CardHeader({ className, ...props }) {
  return (
    <div
      data-slot="card-header"
      className={cn(
        // @container/card-header enables container queries scoped to the card header
        // grid setup handles alignment of title/description and action
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 pt-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className,
      )}
      {...props}
    />
  );
}

//---

/**
 * ## CardTitle
 * Primary heading for the card content.
 */
// Original: function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
function CardTitle({ className, ...props }) {
  return (
    <h4
      data-slot="card-title"
      // Note: The H4 tag is often used for semantic titling within a card.
      className={cn("leading-none", className)}
      {...props}
    />
  );
}

//---

/**
 * ##  CardDescription
 * Supplementary text to describe the card's purpose or content.
 */
// Original: function CardDescription({ className, ...props }: React.ComponentProps<"div">) {
function CardDescription({ className, ...props }) {
  return (
    <p
      data-slot="card-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  );
}

//---

/**
 * ##  CardAction
 * A placement slot for elements like buttons or dropdown menus, typically in the top right.
 */
// Original: function CardAction({ className, ...props }: React.ComponentProps<"div">) {
function CardAction({ className, ...props }) {
  return (
    <div
      data-slot="card-action"
      // Grid placement classes to align the action correctly within the CardHeader grid
      className={cn(
        "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
        className,
      )}
      {...props}
    />
  );
}

//---

/**
 * ##  CardContent
 * The main body content area of the card.
 */
// Original: function CardContent({ className, ...props }: React.ComponentProps<"div">) {
function CardContent({ className, ...props }) {
  return (
    <div
      data-slot="card-content"
      // Applies padding and ensures padding is added to the bottom of the last content element.
      className={cn("px-6 [&:last-child]:pb-6", className)}
      {...props}
    />
  );
}

//---

/**
 * ##  CardFooter
 * A dedicated area at the bottom for actions or summary information.
 */
// Original: function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
function CardFooter({ className, ...props }) {
  return (
    <div
      data-slot="card-footer"
      className={cn("flex items-center px-6 pb-6 [.border-t]:pt-6", className)}
      {...props}
    />
  );
}

//---

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
};