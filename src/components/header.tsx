"use client";
import {
  SignInButton,
  SignUpButton,
  SignOutButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs'

import { usePathname } from 'next/navigation';

import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

import { AuthButtons } from './AuthButtons';
import { useState, useMemo } from "react";

export function Header() {
  const { isLoaded, isSignedIn, user } = useUser();
  const pathname = usePathname();

  const allNavItems = [
    {
      name: "Explore",
      link: "/",
      requiresAuth: false,
    },
    {
      name: "Dashboard",
      link: "/dashboard",
      requiresAuth: true,
    },
    {
      name: "History",
      link: "/history",
      requiresAuth: true,
    },
  ];

  // Filter navigation items based on authentication status
  const navItems = useMemo(() => {
    if (!isLoaded) {
      // While loading, show only public items
      return allNavItems.filter(item => !item.requiresAuth);
    }
    
    if (isSignedIn) {
      // Show all items when signed in
      return allNavItems;
    }
    
    // Show only public items when not signed in
    return allNavItems.filter(item => !item.requiresAuth);
  }, [isLoaded, isSignedIn]);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="sticky w-full top-4 z-50">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} currentPath={pathname} />
          <AuthButtons />
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <div className="flex items-center gap-4 mr-2">
              <SignedIn>
                <UserButton />
              </SignedIn>
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </div>
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-black flex w-full justify-center font-medium hover:text-purple-600 transition-colors"
              >
                <span>{item.name}</span>
              </a>
            ))}
            <div className="flex flex-col w-full justify-center-safe gap-4">
              <SignedOut>
                <SignUpButton>
                  <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer"
                    style={{
                      boxShadow: "2px 2px 1px rgb(0, 0, 0)",
                    }}>
                    Register Now
                  </button>
                </SignUpButton>
                <SignInButton>
                  <button className="text-gray-600 hover:text-gray-900 font-medium cursor-pointer">
                    Already have an account? Login
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <SignOutButton>
                  <button className="hover:text-gray-900 font-medium cursor-pointer bg-[#ff4747] text-white rounded-full text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
                    style={{
                      boxShadow: "2px 2px 1px rgb(0, 0, 0)",
                    }}>
                    Logout
                  </button>
                </SignOutButton>
              </SignedIn>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}