import React, { useState } from 'react'
import { Menu, MenuSection, MenuItem, SidebarMenu, Breadcrumb } from '../components/ui/Menu'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'

const MenuPage = () => {
  const [showCode, setShowCode] = useState({})

  const toggleCode = (exampleId) => {
    setShowCode(prev => ({
      ...prev,
      [exampleId]: !prev[exampleId]
    }))
  }

  return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Menu & Navigation</h1>
        <p className="text-gray-600">
          Flexible navigation components for organizing content and creating intuitive user experiences.
        </p>
      </div>

      {/* Breadcrumb Example */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Breadcrumb Navigation</h2>
        <Card className="p-6 mb-4">
          <Breadcrumb 
            items={[
              { label: "Home", href: "/" },
              { label: "Components", href: "/components" },
              { label: "Navigation", href: "/components/navigation" },
              { label: "Menu" }
            ]}
          />
        </Card>
        
        <button
          onClick={() => toggleCode('breadcrumb')}
          className="text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          {showCode.breadcrumb ? 'Hide' : 'Show'} Code
        </button>
        
        {showCode.breadcrumb && (
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-md overflow-x-auto text-sm mb-8">
            <code>{`<Breadcrumb 
  items={[
    { label: "Home", href: "/" },
    { label: "Components", href: "/components" },
    { label: "Navigation", href: "/components/navigation" },
    { label: "Menu" }
  ]}
/>`}</code>
          </pre>
        )}
      </section>

      {/* Collapsible Menu Example */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Collapsible Sections</h2>
        <p className="text-gray-600 mb-6">Perfect for organizing large amounts of content like in your design system.</p>
        
        <div className="max-w-md mb-4">
          <Menu>
            <MenuSection title="Global Styles" defaultOpen={true}>
              <MenuItem isSubItem>Color Selection</MenuItem>
              <MenuItem isSubItem>Typography</MenuItem>
              <MenuItem isSubItem>Breadcrumbs</MenuItem>
              <MenuItem isSubItem>Accordion</MenuItem>
              <MenuItem isSubItem>Section Layouts</MenuItem>
            </MenuSection>
            
            <MenuSection title="Content Types">
              <MenuItem isSubItem>Heroes and Headers</MenuItem>
              <MenuItem isSubItem>News and Blogs</MenuItem>
              <MenuItem isSubItem>Cards</MenuItem>
              <MenuItem isSubItem>Forms</MenuItem>
              <MenuItem isSubItem>Menus</MenuItem>
            </MenuSection>
            
            <MenuSection title="Page Templates">
              <MenuItem isSubItem>Program landing page</MenuItem>
              <MenuItem isSubItem>Specialty landing page</MenuItem>
              <MenuItem isSubItem>FAQ</MenuItem>
              <MenuItem isSubItem>Blog</MenuItem>
            </MenuSection>
          </Menu>
        </div>

        <button
          onClick={() => toggleCode('collapsible')}
          className="text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          {showCode.collapsible ? 'Hide' : 'Show'} Code
        </button>
        
        {showCode.collapsible && (
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-md overflow-x-auto text-sm mb-8">
            <code>{`<Menu>
  <MenuSection title="Global Styles" defaultOpen={true}>
    <MenuItem isSubItem>Color Selection</MenuItem>
    <MenuItem isSubItem>Typography</MenuItem>
    <MenuItem isSubItem>Breadcrumbs</MenuItem>
    <MenuItem isSubItem>Accordion</MenuItem>
    <MenuItem isSubItem>Section Layouts</MenuItem>
  </MenuSection>
  
  <MenuSection title="Content Types">
    <MenuItem isSubItem>Heroes and Headers</MenuItem>
    <MenuItem isSubItem>News and Blogs</MenuItem>
    <MenuItem isSubItem>Cards</MenuItem>
    <MenuItem isSubItem>Forms</MenuItem>
    <MenuItem isSubItem>Menus</MenuItem>
  </MenuSection>
</Menu>`}</code>
          </pre>
        )}
      </section>

      {/* Sidebar Navigation */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Sidebar Navigation</h2>
        <p className="text-gray-600 mb-6">Full sidebar navigation like in your OER example.</p>
        
        <div className="border rounded-lg overflow-hidden bg-gray-50 mb-4" style={{height: "400px"}}>
          <div className="flex h-full">
            <SidebarMenu title="OER Home" subtitle="Research Support">
              <Menu className="bg-transparent border-0">
                <MenuSection title="Pre-Award" defaultOpen={true}>
                  <MenuItem isSubItem>About Pre-Award</MenuItem>
                  <MenuItem isSubItem>Administration and Staff</MenuItem>
                  <MenuItem isSubItem hasSubmenu>Proposal Support</MenuItem>
                  <MenuItem isSubItem hasSubmenu>Research Communication</MenuItem>
                  <MenuItem isSubItem hasSubmenu>Funding</MenuItem>
                  <MenuItem isSubItem hasSubmenu>Faculty</MenuItem>
                  <MenuItem isSubItem>FAQs</MenuItem>
                  <MenuItem isSubItem>Contact Pre-Award</MenuItem>
                </MenuSection>
                
                <MenuSection title="Post-Award">
                  <MenuItem isSubItem>About Post-Award</MenuItem>
                  <MenuItem isSubItem>Administration and Staff</MenuItem>
                  <MenuItem isSubItem hasSubmenu>Grant Support</MenuItem>
                  <MenuItem isSubItem>Contact Post-Award</MenuItem>
                </MenuSection>
              </Menu>
            </SidebarMenu>
            
            <div className="flex-1 p-6 bg-white">
              <h3 className="text-xl font-semibold mb-2">Main Content Area</h3>
              <p className="text-gray-600">
                This is where your main content would go. The sidebar navigation 
                provides easy access to all sections and subsections.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => toggleCode('sidebar')}
          className="text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          {showCode.sidebar ? 'Hide' : 'Show'} Code
        </button>
        
        {showCode.sidebar && (
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-md overflow-x-auto text-sm mb-8">
            <code>{`<div className="flex h-full">
  <SidebarMenu title="OER Home" subtitle="Research Support">
    <Menu className="bg-transparent border-0">
      <MenuSection title="Pre-Award" defaultOpen={true}>
        <MenuItem isSubItem>About Pre-Award</MenuItem>
        <MenuItem isSubItem>Administration and Staff</MenuItem>
        <MenuItem isSubItem hasSubmenu>Proposal Support</MenuItem>
        <MenuItem isSubItem hasSubmenu>Research Communication</MenuItem>
        <MenuItem isSubItem hasSubmenu>Funding</MenuItem>
        <MenuItem isSubItem hasSubmenu>Faculty</MenuItem>
        <MenuItem isSubItem>FAQs</MenuItem>
        <MenuItem isSubItem>Contact Pre-Award</MenuItem>
      </MenuSection>
      
      <MenuSection title="Post-Award">
        <MenuItem isSubItem>About Post-Award</MenuItem>
        <MenuItem isSubItem>Administration and Staff</MenuItem>
        <MenuItem isSubItem hasSubmenu>Grant Support</MenuItem>
        <MenuItem isSubItem>Contact Post-Award</MenuItem>
      </MenuSection>
    </Menu>
  </SidebarMenu>
  
  <div className="flex-1 p-6 bg-white">
    <h3>Main Content Area</h3>
    <p>Your content goes here...</p>
  </div>
</div>`}</code>
          </pre>
        )}
      </section>

      {/* Simple Menu */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Simple Menu</h2>
        <div className="max-w-sm mb-4">
          <Menu>
            <MenuItem>Dashboard</MenuItem>
            <MenuItem>Projects</MenuItem>
            <MenuItem>Team</MenuItem>
            <MenuItem>Settings</MenuItem>
            <MenuItem>Help</MenuItem>
          </Menu>
        </div>

        <button
          onClick={() => toggleCode('simple')}
          className="text-sm text-blue-600 hover:text-blue-800 mb-4"
        >
          {showCode.simple ? 'Hide' : 'Show'} Code
        </button>
        
        {showCode.simple && (
          <pre className="p-4 bg-gray-900 text-gray-100 rounded-md overflow-x-auto text-sm mb-8">
            <code>{`<Menu>
  <MenuItem>Dashboard</MenuItem>
  <MenuItem>Projects</MenuItem>
  <MenuItem>Team</MenuItem>
  <MenuItem>Settings</MenuItem>
  <MenuItem>Help</MenuItem>
</Menu>`}</code>
          </pre>
        )}
      </section>

      {/* Usage Tips */}
      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Usage Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">When to use MenuSection</h4>
              <p className="text-sm text-gray-600">
                Use MenuSection for grouping related items that users might want to hide/show. 
                Perfect for complex navigation structures.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Sidebar vs Menu</h4>
              <p className="text-sm text-gray-600">
                SidebarMenu is a complete layout component, while Menu is just the navigation list. 
                Use SidebarMenu for app layouts, Menu for dropdowns or embedded navigation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Accessibility</h4>
              <p className="text-sm text-gray-600">
                All components include proper ARIA labels and keyboard navigation support. 
                MenuSections are collapsible with keyboard and screen reader support.
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default MenuPage