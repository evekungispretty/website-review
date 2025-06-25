import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/layout/Navigation'
import ButtonPage from './pages/ButtonPage'
import CardPage from './pages/CardPage'
import MenuPage from './pages/MenuPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-white">
        <Navigation />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/components/button" replace />} />
            <Route path="/components/button" element={<ButtonPage />} />
            <Route path="/components/card" element={<CardPage />} />
            <Route path="/components/menu" element={<MenuPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App