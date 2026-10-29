"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AppBrand, SidebarNav } from "@/components/layout/sidebar";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" aria-label="Buka menu navigasi" />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-sidebar p-0">
        <SheetHeader className="px-5 pt-5">
          <SheetTitle render={<div />}>
            <AppBrand />
          </SheetTitle>
          <SheetDescription className="sr-only">
            Menu navigasi aplikasi MyPlanner
          </SheetDescription>
        </SheetHeader>
        <Separator />
        <div className="px-3">
          <SidebarNav onNavigate={() => setOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}

