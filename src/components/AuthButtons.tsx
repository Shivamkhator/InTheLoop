// components/AuthButtons.tsx
"use client";

import React from "react";
import { useUser, SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";
import { NavbarButton } from "./ui/resizable-navbar";
import { AuthButtonsSkeleton } from "./ui/AuthButtonsSkeletion";

export const AuthButtons = () => {
    const { isLoaded, user } = useUser();

    if (!isLoaded) {
        return <AuthButtonsSkeleton />;
    }

    return (
        <div className="flex items-center space-x-4 mr-2">
            <SignedIn>
                <p className="text-sm font-medium py-2">
                    Hi, {user?.username || user?.firstName || "there"}!
                </p>
                <UserButton/>
            </SignedIn>
            <SignedOut>
                <SignUpButton>
                    <NavbarButton as="button" className="bg-blue-600 text-white hover:bg-blue-700"
                        style={{
                            border: '0.5px solid #000',
                            boxShadow: '2px 2px 2px rgb(0, 0, 0)',
                        }}
                    >
                        Register Now
                    </NavbarButton>
                </SignUpButton>
                <SignInButton>
                    <NavbarButton as="button"
                        style={
                            {
                                border: '0.5px solid #000',
                                boxShadow: '2px 2px 2px rgb(0, 0, 0)',
                            }
                        }
                        className="bg-transparent">
                        Login
                    </NavbarButton>
                </SignInButton>
                
            </SignedOut>
        </div>
    );
};