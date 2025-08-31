'use client'

import Link from 'next/link'
import {
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'

export default function Header() {
    return (
        <header className="flex justify-between items-center p-4 px-8 h-20 bg-white">

            <Link href="/" className="flex items-center">
                <img src="https://skybee.vercel.app/InTheLoop.svg" alt="InTheLoop Logo" className="h-20 w-20" />
            </Link>

            <div className="flex items-center gap-4">
                <nav className="hidden md:flex gap-6 items-center">
                    <Link href="/events" className="text-gray-600 hover:text-gray-900">Events</Link>
                    <Link href="/history" className="text-gray-600 hover:text-gray-900">History</Link>
                </nav>
                <SignedOut>
                    <SignInButton>
                        <button className="text-gray-600 hover:text-gray-900 font-medium">
                            Sign In
                        </button>
                    </SignInButton>
                    <SignUpButton>
                        <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                            Sign Up
                        </button>
                    </SignUpButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </header>
    )
}

