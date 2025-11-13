'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, Camera, Image, BookOpen, User } from 'lucide-react';

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
      label: 'Beranda',
      active: pathname === '/'
    },
    {
      href: '/galeri',
      icon: Image,
      label: 'Galeri',
      active: pathname === '/galeri'
    },
    {
      href: '/ar',
      icon: Camera,
      label: 'AR',
      active: pathname === '/ar'
    },
    {
      href: '/storybook',
      icon: BookOpen,
      label: 'Buku Cerita',
      active: pathname === '/storybook'
    },
    {
      href: '/my-pusaka',
      icon: User,
      label: 'PusakaKu',
      active: pathname === '/my-pusaka'
    }
  ];

  return (
    <nav className="bottom-nav">
      <div className="flex justify-around items-center max-w-md mx-auto px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isAR = item.label === 'AR';
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={(e) => handleSmoothScroll(e, item.href)}
              className={`bottom-nav-item ${item.active ? 'active' : ''} ${isAR ? 'ar-button' : ''}`}
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
