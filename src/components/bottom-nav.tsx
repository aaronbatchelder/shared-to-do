'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, BookOpenIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeIconSolid, BookOpenIcon as BookOpenIconSolid, Cog6ToothIcon as Cog6ToothIconSolid } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/home', label: 'Week', icon: HomeIcon, activeIcon: HomeIconSolid },
  { href: '/home/recipes', label: 'Recipes', icon: BookOpenIcon, activeIcon: BookOpenIconSolid },
  { href: '/home/settings', label: 'Settings', icon: Cog6ToothIcon, activeIcon: Cog6ToothIconSolid },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#FFFBF7]/95 backdrop-blur-lg border-t border-[#FEE4D6] pb-safe">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/home' && pathname.startsWith(item.href))
          const Icon = isActive ? item.activeIcon : item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center py-3 px-6',
                isActive ? 'text-[#F97066]' : 'text-[#8B8680] hover:text-[#4A4640]'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
