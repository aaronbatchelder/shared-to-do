'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { HomeIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import { HomeIcon as HomeIconSolid, BookOpenIcon as BookOpenIconSolid } from '@heroicons/react/24/solid'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Week', icon: HomeIcon, activeIcon: HomeIconSolid },
  { href: '/recipes', label: 'Recipes', icon: BookOpenIcon, activeIcon: BookOpenIconSolid },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t pb-safe">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          const Icon = isActive ? item.activeIcon : item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center py-2 px-4 min-w-[80px]',
                isActive ? 'text-emerald-600' : 'text-gray-500'
              )}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
