"use client"

import type React from "react"

import { useState } from "react"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useVocabStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useTransition } from "@/components/ui/section-transition"

interface MobileNavProps {
  items: {
    icon: React.ElementType
    label: string
    path: string
    section: string
  }[]
  className?: string
}

export function MobileNav({ items, className }: MobileNavProps) {
  const [open, setOpen] = useState(false)
  const { navigateTo } = useTransition()
  const { userName, userAvatar } = useVocabStore()

  const handleNavigation = (section: string) => {
    navigateTo(section as any)
    setOpen(false)
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className={cn("md:hidden", className)}>
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[80vw] max-w-[350px] p-0">
        <SheetHeader className="p-4 pb-2 border-b bg-gradient-to-r from-purple-500/10 to-indigo-500/10">
          <SheetTitle className="flex items-center gap-2">
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-left text-base">{userName}</p>
              <p className="text-xs text-muted-foreground">student@example.com</p>
            </div>
          </SheetTitle>
        </SheetHeader>
        <div className="py-6 px-4">
          <nav className="flex flex-col gap-2">
            {items.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Button
                  variant="ghost"
                  className="justify-start gap-3 h-12 w-full text-base relative overflow-hidden group"
                  onClick={() => handleNavigation(item.section)}
                >
                  <div className="relative z-10 flex items-center gap-3">
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </div>

                  {/* Hover effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100"
                    initial={false}
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                </Button>
              </motion.div>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

