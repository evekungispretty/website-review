import React, { useState } from 'react'
import { Button } from '../components/ui/Button'
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card'

const ButtonPage = () => {
  const [showCode, setShowCode] = useState({})

  // Function to toggle code visibility for different examples
  const toggleCode = (exampleId) => {
    setShowCode(prev => ({
      ...prev,
      [exampleId]: !prev[exampleId]
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Button</h1>
        <p className="text-gray-600">
          A clickable button component with multiple variants and sizes.
        </p>
      </div>

      {/* Basic Example */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Basic Examples</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-4">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
          </div>
          
          <button
            onClick={() => toggleCode('basic')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showCode.basic ? 'Hide' : 'Show'} Code
          </button>
          
          {showCode.basic && (
            <pre className="mt-4 p-4 bg-gray-900 text-gray-100 rounded-md overflow-x-auto text-sm">
              <code>{`<Button>Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>`}</code>
            </pre>
          )}
        </CardContent>
      </Card>

      {/* Size Examples */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Sizes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
          
          <button
            onClick={() => toggleCode('sizes')}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {showCode.sizes ? 'Hide' : 'Show'} Code
          </button>
          
          {showCode.sizes && (
            <pre className="mt-4 p-4 bg-gray-900 text-gray-100 rounded-md overflow-x-auto text-sm">
              <code>{`<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>`}</code>
            </pre>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ButtonPage