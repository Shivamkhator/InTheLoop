"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
    motion,
    AnimatePresence,
    useScroll,
    useMotionValueEvent,
} from "motion/react";

import React, { useRef, useState } from "react";


interface NavbarProps {
    children: React.ReactNode;
    className?: string;
}

interface NavBodyProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface NavItemsProps {
    items: {
        name: string;
        link: string;
    }[];
    className?: string;
    onItemClick?: () => void;
    currentPath: string; 
}

interface MobileNavProps {
    children: React.ReactNode;
    className?: string;
    visible?: boolean;
}

interface MobileNavHeaderProps {
    children: React.ReactNode;
    className?: string;
}

interface MobileNavMenuProps {
    children: React.ReactNode;
    className?: string;
    isOpen: boolean;
    onClose: () => void;
}

// --- Define the custom glass style objects ---
const GLASS_STYLE_BASE = {
    border: "1px solid #000000",
    boxShadow: "6px 6px 0px 0px rgba(76, 29, 149, 0.5)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
};

const GLASS_STYLE_NAVBAR = {
    ...GLASS_STYLE_BASE,
    backgroundColor: "rgba(255, 255, 255, 0.15)", // 15% opacity (Main bar)
};

const GLASS_STYLE_MENU_DROPDOWN = {
    ...GLASS_STYLE_BASE,
    backgroundColor: "rgba(255, 255, 255, 0.90)", // 90% opacity (Dropdown for readability)
};
// ----------------------------------------------------------------

export const Navbar = ({ children, className }: NavbarProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const { scrollY } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    });
    const [visible, setVisible] = useState<boolean>(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (latest > 50) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    });

    return (
        <motion.div
            ref={ref}
            className={cn("sticky inset-x-0 top-20 z-40 w-full", className)}
        >
            {React.Children.map(children, (child) =>
                React.isValidElement(child)
                    ? React.cloneElement(
                        child as React.ReactElement<{ visible?: boolean }>,
                        { visible },
                    )
                    : child,
            )}
        </motion.div>
    );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
    return (
        <motion.div
            animate={{
                width: visible ? "40%" : "100%",
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            style={{
                minWidth: "800px",
                ...GLASS_STYLE_NAVBAR,
            }}
            className={cn(
                "relative z-[60] mx-auto hidden w-full max-w-7xl flex-row items-center justify-between self-start rounded-full bg-transparent px-4 py-2 lg:flex",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

// ---------------------- FIXED NAVITEMS COMPONENT ----------------------
export const NavItems = ({ items, className, onItemClick, currentPath }: NavItemsProps) => {
    const [hovered, setHovered] = useState<number | null>(null);
    
    // FIX: Ensure currentPath is a string. If it's undefined, default to '/' 
    // or an empty string, though '/' is better for initial Next.js load.
    const safeCurrentPath = currentPath || '/';

    return (
        <motion.div
            onMouseLeave={() => setHovered(null)}
            className={cn(
                "absolute inset-0 hidden flex-1 flex-row items-center justify-center space-x-2 text-sm font-medium text-zinc-600 transition duration-200 hover:text-zinc-800 lg:flex lg:space-x-2",
                className,
            )}
        >
            {items.map((item, idx) => {
                const linkPath = item.link || ''; 

                // Use safeCurrentPath for all comparisons/methods
                const isActive = (safeCurrentPath === linkPath) || 
                                 (linkPath !== '/' && safeCurrentPath.startsWith(linkPath));

                return (
                    <a
                        onMouseEnter={() => setHovered(idx)}
                        onClick={onItemClick}
                        className={cn(
                            "relative px-4 py-2 text-black transition-colors duration-300",
                            isActive && "font-extrabold text-purple-700", 
                        )}
                        key={`link-${idx}`}
                        href={linkPath} 
                    >
                        {(hovered === idx || isActive) && (
                            <motion.div
                                layoutId="hovered"
                                className={cn(
                                    "absolute inset-0 h-full w-full rounded-full",
                                    isActive ? "bg-purple-300/60" : "bg-blue-200" 
                                )}
                                style={{ zIndex: 1 }}
                            />
                        )}
                        <span className="relative z-20">{item.name}</span>
                    </a>
                );
            })}
        </motion.div>
    );
};
// --------------------------------------------------------------------

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
    return (
        <motion.div
            animate={{
                width: "100%",
                paddingRight: "12px",
                paddingLeft: "12px",
            }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 50,
            }}
            style={{
                borderRadius: "40px",
                ...GLASS_STYLE_NAVBAR,
            }}
            className={cn(
                "relative z-50 mx-auto flex w-full max-w-[calc(100vw-2rem)] flex-col items-center justify-between bg-transparent px-4 py-2 lg:hidden",
                className,
            )}
        >
            {children}
        </motion.div>
    );
};

export const MobileNavHeader = ({
    children,
    className,
}: MobileNavHeaderProps) => {
    return (
        <div
            className={cn(
                "flex w-full flex-row items-center justify-between",
                className,
            )}
        >
            {children}
        </div>
    );
};

export const MobileNavMenu = ({
    children,
    className,
    isOpen,
    onClose,

}: MobileNavMenuProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    style={{
                        ...GLASS_STYLE_MENU_DROPDOWN, 
                    }}
                    exit={{ opacity: 0 }}
                    className={cn(
                        "absolute inset-x-0 top-20 z-50 flex w-full flex-col items-start justify-start gap-4 rounded-[40px] bg-transparent px-4 py-8",
                        className,
                    )}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export const MobileNavToggle = ({
    isOpen,
    onClick,
}: {
    isOpen: boolean;
    onClick: () => void;
}) => {
    return isOpen ? (
        <IconX className="text-black" onClick={onClick} />
    ) : (
        <IconMenu2 className="text-black" onClick={onClick} />
    );
};

export const NavbarLogo = () => {
    return (
        <a
            href="/"
            className="relative z-20 mr-4 flex items-center space-x-2 px-2 py-1 text-sm font-normal text-black"
        >
            <img
                src="https://skybee.vercel.app/InTheLoop.svg"
                alt="logo"
                width={40}
                height={40}
                loading="eager"
            />
            <span className="text-xl font-medium text-black p-2">InTheLoop</span>
        </a>
    );
};

export const NavbarButton = ({
    href,
    as: Tag = "a",
    children,
    className,
    ...props
}: {
    href?: string;
    as?: React.ElementType;
    children: React.ReactNode;
    className?: string;
} & (
        | React.ComponentPropsWithoutRef<"a">
        | React.ComponentPropsWithoutRef<"button">
    )) => {
    const baseStyles =
        "px-4 py-2 rounded-md bg-white button bg-white text-black text-sm font-bold relative cursor-pointer hover:-translate-y-0.5 transition inline-block text-center";


    return (
        <Tag
            href={href}
            loading="eager"

            className={cn(baseStyles, className)}
            {...props}
        >
            {children}
        </Tag>
    );
};