import type { ILinkOption } from "@/types/components/layout/types";
import Link from "next/link";

interface Props {
    option: ILinkOption;
    onClick?: () => void;
}

export default function LinkOption({ option, onClick }: Props) {
    return (
        <li>
            {
                option.anchorTag ? (
                    <a
                        href={option.href}
                        className={`w-fit flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${option.classes}`}
                        onClick={onClick}
                    >
                        {option.icon}
                        <span className="text-sm font-medium"> {option.label} </span>
                    </a>
                ) :
                (
                    <Link
                        href={option.href}
                        className={`w-fit flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 ${option.classes}`}
                        onClick={onClick}
                    >
                        {option.icon}
                        <span className="text-sm font-medium"> {option.label} </span>
                    </Link>
                )
            }
        </li>
    )
}