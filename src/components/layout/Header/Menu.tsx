"use client"

import { JSX, useState } from "react";

interface LinkOption {
    label: string;
    href: string;
    icon: JSX.Element;
    classes?: string;
}

interface MenuProps {
    pictureSrc: string;
    links: Array<LinkOption>;
}

export default function Menu({ pictureSrc, links }: MenuProps) {
    const [showMenu, setShowMenu] = useState(false);

    const renderMenuOptions = () => {
        return links.map((option, index) => {
            return (
                <li key={index}>
                    <a
                        href={option.href}
                        className={`${option.classes} flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700`}
                    >
                    {option.icon}

                    <span className="text-sm font-medium"> {option.label} </span>
                    </a>
                </li>
            )
        })
    }

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    }

    return (
        <div className="relative">
            <button
                type="button"
                className="overflow-hidden rounded-full border border-gray-100 shadow-inner"
                onClick={() => handleMenuToggle()}
            >
                {/* Mobile menu button */}
                <div
                    className="block rounded-sm p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden hover:cursor-pointer"
                >
                    <span className="sr-only">Toggle menu</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="size-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </div>

                {/* Profile Photo */}
                <img
                    src={pictureSrc}
                    alt=""
                    className="size-10 object-cover hidden md:block hover:cursor-pointer"
                />
            </button>

            {   showMenu && (
                <ul className="space-y-1 absolute top-16 right-0 bg-white rounded-md p-1 shadow-md">
                    { renderMenuOptions() }
                </ul>
            )}  
        </div>
    )
}