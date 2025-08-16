import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import ButtonPage from './pages/ButtonPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-white">
        <Navigation />
        <main className="flex-1">
          <Routes>
            {/* Redirect root path to first component */}
            <Route path="/" element={<Navigate to="/components/button" replace />} />
            <Route path="/components/button" element={<ButtonPage />} />
            {/* I'll add more routes as I create more components */}
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App