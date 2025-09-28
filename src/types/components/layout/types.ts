import { JSX } from "react";

export interface ILinkOption {
    code              : string;
    label             : string;
    href              : string;
    icon              : JSX.Element;
    visible           : Boolean;
    showInHeader      : boolean;
    showInSidebar     : boolean;
    showInProfileMenu : boolean;
    anchorTag         : boolean;
    classes?          : string;
}
