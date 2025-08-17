import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'

const Navigation = () => {
  const location = useLocation()

  // List of components we'll showcase
  const components = [
    { name: "Button", path: "/components/button" },
    { name: "Card", path: "/components/card" },
    { name: "Menu", path: "/components/menu" },
    // add more as I create them
  ]

  return (
    <nav className="w-64 min-h-screen bg-gray-50 border-r border-gray-200 p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">UI Components</h1>
        <p className="text-sm text-gray-600">Your component library</p>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Components</h2>
        <ul className="space-y-1">
          {components.map((component) => (
            <li key={component.name}>
              <Link
                to={component.path}
                className={cn(
                  "block px-3 py-2 rounded-md text-sm transition-colors",
                  location.pathname === component.path
                    ? "bg-blue-100 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                {component.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}

export default Navigation