"use client"
import { useState } from "react";
import { RiCloseLargeLine } from "react-icons/ri";
import { RxHamburgerMenu } from "react-icons/rx";
import ProfileBubble from "./ProfileBubble";
import { ILinkOption } from "@/types/components/layout/types";
import LinkOption from "./LinkOption";

interface Props {
    pictureSrc : string;
    links      : Array<ILinkOption>;
}

export default function HamburgerBubble({ pictureSrc, links }: Props) {
    const [menuVisible, setMenuVisible] = useState(false);

    const handleMenuToggle = () => {
        setMenuVisible(!menuVisible);
    }

    /**
     * Renders the link options for the profile menu.
     * @returns An array of LinkOption components.
     */
    const renderLinkOptions = () => {
        return links.map((option, index) => {
            if(option.showInSidebar && option.visible) { // Check if the option should be shown in the profile menu
                return (
                    <LinkOption 
                        key={index} 
                        option={option}
                        onClick={() => handleMenuToggle()}
                    />
                )
            }
        }).filter(Boolean); // Remove any undefined/null values
    }

    return (
        <>
            <div className="block md:hidden z-100">
                <button
                    type="button"
                    className="overflow-hidden rounded-full border border-gray-100 shadow-inner"
                    onClick={handleMenuToggle}
                >
                    {/* Mobile menu button */}
                    <div
                        className="block rounded-sm p-2.5 text-gray-600 transition hover:text-gray-600/75 md:hidden hover:cursor-pointer"
                    >
                        <span className="sr-only">Toggle menu</span>
                        {
                            menuVisible ? <RiCloseLargeLine /> : <RxHamburgerMenu />
                        }
                    </div>
                </button>
            </div>

            <div 
                className={`fixed top-0 left-0 w-full h-full bg-slate-100 bg-opacity-50 z-50 transition-opacity duration-500 flex flex-col items-center justify-start pt-16 gap-4 ${
                    menuVisible ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                <ProfileBubble 
                    pictureSrc={pictureSrc}
                    classes=""
                    menuVisible={false} 
                />
                <ul className="flex flex-col space-y-4">
                    { renderLinkOptions() }
                </ul>
            </div>  
        </>
    )
}