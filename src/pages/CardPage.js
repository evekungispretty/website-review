import React, { useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/Card";

const CardPage = () => {
    const [showCode, setShowCode] = useState ({})

    const toggleCode = (exampleId) => {
        setShowCode(prev => ({
            ...prev,
            [exampleId]: !prev[exampleId]
        }))
    }

    return (
        <div classNmae="max-w-4xl mx-auto p-8">
            <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Card</h1>
                <p className="text-gray-600">
                    A flexible card component for displaying content in a structured way.
                </p>
            </div>

       
        {/* Card*/ }
        <Card className="mb-8">
            <CardHeader>
                <CardTitle>Basic Card</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This is a simple card with a title and content.</p>
            </CardContent>
        </Card> 

        </div>
    )
}

export default CardPage
