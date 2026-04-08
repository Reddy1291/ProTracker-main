"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";

// --- Collapsible Component ---

/**
 * ## 📂 Collapsible
 * The main container for the collapsible component.
 */
// Original TypeScript signature:
// function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
function Collapsible(props) {
  return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />;
}

//---

/**
 * ## 👆 CollapsibleTrigger
 * The interactive element that toggles the open/closed state of the content.
 */
// Original TypeScript signature:
// function CollapsibleTrigger({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
function CollapsibleTrigger(props) {
  return (
    <CollapsiblePrimitive.CollapsibleTrigger
      data-slot="collapsible-trigger"
      {...props}
    />
  );
}

//---

/**
 * ## 📦 CollapsibleContent
 * The content area that is hidden or shown when the trigger is activated.
 */
// Original TypeScript signature:
// function CollapsibleContent({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) {
function CollapsibleContent(props) {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      data-slot="collapsible-content"
      {...props}
    />
  );
}

//---

export { Collapsible, CollapsibleTrigger, CollapsibleContent };