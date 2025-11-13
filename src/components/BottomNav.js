'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Camera, Box, Info } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const handleSmoothScroll = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const navItems = [
    {
      href: '/',
      icon: Home,
      label: 'Home',
      active: pathname === '/'
    },
    {
      href: '/ar',
      icon: Camera,
      label: 'AR',
      active: pathname === '/ar'
    },
    {
      href: '/model-viewer',
      icon: Box,
      label: '3D Model',
      active: pathname === '/model-viewer'
    },
    {
      href: '#about',
      icon: Info,
      label: 'About',
      active: false
    }
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
              className={`bottom-nav-item ${item.active ? 'active' : ''}`}
            >
              <Icon />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
