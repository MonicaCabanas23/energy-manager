"use client"
import { ILinkOption } from "@/types/components/layout/types";
import { useState } from "react";
import LinkOption from "./LinkOption";

interface Props {
    pictureSrc   : string;
    classes     ?: string;
    links       ?: Array<ILinkOption>;
    menuVisible ?: boolean;
}

export default function ProfileBubble({pictureSrc, classes="", links=[], menuVisible=true}: Props) {
    const [showMenu, setShowMenu] = useState(false);

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    }

    /**
     * Renders the link options for the profile menu.
     * @returns An array of LinkOption components.
     */
    const renderLinkOptions = () => {
        return links.map((option, index) => {
            if(option.showInProfileMenu) { // Check if the option should be shown in the profile menu
                return (
                    <LinkOption key={index} option={option} />
                )
            }
        }).filter(Boolean); // Remove any undefined/null values
    }

    console.log('foto', pictureSrc);
    return (
        <div className={`relative ${classes}`}>
            <button
                type="button"
                className="overflow-hidden rounded-full border border-gray-100 shadow-inner"
                onClick={() => handleMenuToggle()}
            >
                {/* Profile Photo */}
                <img
                    src={pictureSrc}
                    alt=""
                    className="size-10 object-cover hover:cursor-pointer"
                />
            </button>

            {   menuVisible && showMenu && (
                <ul className="flex flex-col space-y-1 absolute top-16 right-0 bg-white rounded-md p-1 shadow-md">
                    { renderLinkOptions() }
                </ul>
            )}  
        </div>
    )
}