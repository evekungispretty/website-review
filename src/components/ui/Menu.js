import React, { useState } from 'react'
import { ChevronRight, ChevronDown, Plus, Minus } from 'lucide-react'
import { cn } from "../../utils/cn"

// Main Menu container
const Menu = React.forwardRef(({ className, children, ...props }, ref) => (
  <nav
    ref={ref}
    className={cn("bg-white border border-gray-200 rounded-md", className)}
    {...props}
  >
    <ul className="py-2">
      {children}
    </ul>
  </nav>
))
Menu.displayName = "Menu"

// Menu section with collapsible functionality
const MenuSection = ({ title, children, defaultOpen = false, className }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <li className={cn("", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg">{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      {isOpen && (
        <ul className="bg-gray-50 border-t border-gray-200">
          {children}
        </ul>
      )}
    </li>
  )
}

// Individual menu item
const MenuItem = React.forwardRef(({ 
  className, 
  children, 
  href, 
  onClick, 
  isSubItem = false,
  hasSubmenu = false,
  ...props 
}, ref) => {
  const Component = href ? 'a' : 'button'
  
  return (
    <li>
      <Component
        ref={ref}
        href={href}
        onClick={onClick}
        className={cn(
          "w-full flex items-center justify-between px-4 py-2 text-left text-gray-700 hover:bg-gray-100 transition-colors",
          isSubItem && "pl-8 text-sm",
          className
        )}
        {...props}
      >
        <span>{children}</span>
        {hasSubmenu && <Plus className="h-3 w-3" />}
      </Component>
    </li>
  )
})
MenuItem.displayName = "MenuItem"

// Sidebar navigation component (like your examples)
const SidebarMenu = ({ className, children, title, subtitle, ...props }) => (
  <aside
    className={cn(
      "w-64 bg-gray-50 border-r border-gray-200 min-h-screen",
      className
    )}
    {...props}
  >
    {(title || subtitle) && (
      <div className="p-4 border-b border-gray-200">
        {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
    )}
    <div className="p-4">
      {children}
    </div>
  </aside>
)

// Breadcrumb component
const Breadcrumb = ({ items, className }) => (
  <nav className={cn("flex", className)} aria-label="Breadcrumb">
    <ol className="inline-flex items-center space-x-1 md:space-x-3">
      {items.map((item, index) => (
        <li key={index} className="inline-flex items-center">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
          )}
          {item.href ? (
            <a
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              {item.label}
            </a>
          ) : (
            <span className="text-sm font-medium text-gray-500">
              {item.label}
            </span>
          )}
        </li>
      ))}
    </ol>
  </nav>
)

export { Menu, MenuSection, MenuItem, SidebarMenu, Breadcrumb }