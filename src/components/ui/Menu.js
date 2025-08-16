import React from "react";
import { ChevronRight, ChevronDown, Plus, Minus } from "lucide-react";
import { cn } from "../../utils/cn";

//main menu container
const Menu = React.forwardRef(({ className, children, ...props }, ref) => (

<nav
ref={ref}
className={cn("", className)}
{...props}
>

    <ul className="py-2">
        {children}
    </ul>


</nav>
))
Menu.displayName = "Menu";

//menu section w collapsible functionality

const MenuSection = ({ title, children, defaultOpen = false, className }) => {
    const [isOpen, setIsOpen ] = useState(defaultOpen)
    
    return (
        <li className={cn("", className)}>
            <button
            onClick={() => setIsOpen(!isOpen)} 
            className="flex items-center w-full justify-between px-4 py-2 text-left text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                <span className={"text-lg"}>
                    {title}
                </span>

            {isOpen ? (<ChevronDown className="h-4 w-4" /> ) :  (<ChevronRight className="h-4 w-4" />)}
            </button>


        </li>

    )
}

