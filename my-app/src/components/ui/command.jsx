"use client";

import * as React from "react";
import { Command as CommandPrimitive } from "cmdk";
import { SearchIcon } from "lucide-react";

// Assuming 'cn' and 'Dialog' components are imported from existing utility files
import { cn } from "./utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./dialog";

// --- 💻 Core Command Component ---

/**
 * ## Command
 * The main container for the command palette, providing base styling for cmdk.
 */
// Original TypeScript signature: function Command({ className, ...props }: React.ComponentProps<typeof CommandPrimitive>)
function Command({
  className,
  ...props
}) {
  return (
    <CommandPrimitive
      data-slot="command"
      className={cn(
        "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
        className,
      )}
      {...props}
    />
  );
}

// --- 📦 Command Dialog Wrapper ---

/**
 * ## CommandDialog
 * Combines the Command component with a Dialog for a modal command palette experience.
 */
// Original TypeScript signature: function CommandDialog({ title = "Command Palette", description = "Search for a command to run...", children, ...props }: React.ComponentProps<typeof Dialog> & { title?: string; description?: string; })
function CommandDialog({
  title = "Command Palette",
  description = "Search for a command to run...",
  children,
  ...props
}) {
  return (
    <Dialog {...props}>
      {/* Screen reader only header for accessibility */}
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <DialogContent className="overflow-hidden p-0">
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground **:data-[slot=command-input-wrapper]:h-12 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]]:px-2 [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
}

// --- 🔍 Command Input ---

/**
 * ## CommandInput
 * The search input field with a decorative icon.
 */
// Original TypeScript signature: function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Input>)
function CommandInput({
  className,
  ...props
}) {
  return (
    <div
      data-slot="command-input-wrapper"
      className="flex h-9 items-center gap-2 border-b px-3"
    >
      <SearchIcon className="size-4 shrink-0 opacity-50" />
      <CommandPrimitive.Input
        data-slot="command-input"
        className={cn(
          "placeholder:text-muted-foreground flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        {...props}
      />
    </div>
  );
}

// --- 📃 Command List ---

/**
 * ## CommandList
 * The scrollable container for command items and groups.
 */
// Original TypeScript signature: function CommandList({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.List>)
function CommandList({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.List
      data-slot="command-list"
      className={cn(
        "max-h-[300px] scroll-py-1 overflow-x-hidden overflow-y-auto",
        className,
      )}
      {...props}
    />
  );
}

// --- ❌ Command Empty ---

/**
 * ## CommandEmpty
 * Message displayed when no results are found.
 */
// Original TypeScript signature: function CommandEmpty({ ...props }: React.ComponentProps<typeof CommandPrimitive.Empty>)
function CommandEmpty(props) {
  return (
    <CommandPrimitive.Empty
      data-slot="command-empty"
      className="py-6 text-center text-sm"
      {...props}
    />
  );
}

// --- 📁 Command Group ---

/**
 * ## CommandGroup
 * Used to categorize command items with a heading.
 */
// Original TypeScript signature: function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Group>)
function CommandGroup({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Group
      data-slot="command-group"
      className={cn(
        "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
        className,
      )}
      {...props}
    />
  );
}

// --- 📏 Command Separator ---

/**
 * ## CommandSeparator
 * A horizontal line to divide command groups.
 */
// Original TypeScript signature: function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Separator>)
function CommandSeparator({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Separator
      data-slot="command-separator"
      className={cn("bg-border -mx-1 h-px", className)}
      {...props}
    />
  );
}

// --- 💡 Command Item ---

/**
 * ## CommandItem
 * An individual, selectable command item.
 */
// Original TypeScript signature: function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandPrimitive.Item>)
function CommandItem({
  className,
  ...props
}) {
  return (
    <CommandPrimitive.Item
      data-slot="command-item"
      className={cn(
        "data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  );
}

// --- ⚡ Command Shortcut ---

/**
 * ## CommandShortcut
 * A visual display for keyboard shortcuts on command items.
 */
// Original TypeScript signature: function CommandShortcut({ className, ...props }: React.ComponentProps<"span">)
function CommandShortcut({
  className,
  ...props
}) {
  return (
    <span
      data-slot="command-shortcut"
      className={cn(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
}

// --- Exports ---

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};