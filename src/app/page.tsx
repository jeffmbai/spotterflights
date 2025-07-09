"use client"

import { useState } from "react"
import { MainBackground } from "../components/MainBackground"
import { SearchForm } from "../components/SearchForm"
import { Header } from "../components/header"


interface SearchParams {
  from: string
  to: string
  departDate: Date | undefined
  returnDate: Date | undefined
  passengers: number
  tripType: string
}

export default function HomePage() {
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (params: SearchParams) => {
    console.log("Searching with params:", params)
    setIsSearching(true)

    // Simulate API call
    setTimeout(() => {
      setIsSearching(false)
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative">
      <MainBackground />
      <Header />

      <main className="relative max-w-7xl mx-auto px-4 sm:px-4 lg:px-6 py-4 sm:py-6">
        {/* Hero Section */}
        <div className="text-center mb-1 sm:mb-4">
          <div className="inline-flex items-center px-4 py-1 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-sm font-medium text-blue-800 mb-6 border border-blue-200/50">
            ✈️ Over 1M+ flights searched daily
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-2 leading-tight">
            Find Your Perfect
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Flight
            </span>
          </h1>
          
        </div>

        {/* Enhanced Search Component */}
        <SearchForm onSearch={handleSearch} isSearching={isSearching} />
      </main>
    </div>
  )
}
