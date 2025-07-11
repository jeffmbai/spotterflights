"use client"

import { useState } from "react"
import { SearchForm } from "../components/SearchForm"
import { SearchResults } from "../components/SearchResults"
import { MainBackground } from "../components/MainBackground"
import { Header } from "../components/header"
import { searchFlights } from "../lib/api"
import { useAirports } from "../lib/context/airport-context"
import type { SearchParams, FlightResult, FlightSearchParams } from "../lib/types"

export default function HomePage() {
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<FlightResult[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [currentSearch, setCurrentSearch] = useState<SearchParams | null>(null)

  const { isLoading: isLoadingAirports } = useAirports()

  const handleSearch = async (params: SearchParams) => {
    if (!params.fromAirport || !params.toAirport || !params.departDate) {
      return
    }

    setIsSearching(true)
    setHasSearched(true)
    setCurrentSearch(params)

    try {
       const searchParams: FlightSearchParams = {
        from: params.fromAirport.skyId,
        to: params.toAirport.skyId,
        fromEntityId: params.fromAirport.entityId, 
        toEntityId: params.toAirport.entityId, 
        departDate: params.departDate.toISOString().split("T")[0],
        returnDate: params.returnDate?.toISOString().split("T")[0],
        passengers: params.passengers,
        tripType: params.tripType as "roundtrip" | "oneway" | "multicity",
      }

      const results = await searchFlights(searchParams)
      setSearchResults(results)
    } catch (error) {
      console.error("Search failed:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleFlightSelect = (flightId: string) => {
    console.log("Selected flight:", flightId)
  }

  const resetSearch = () => {
    setHasSearched(false)
    setCurrentSearch(null)
    setSearchResults([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      <MainBackground />
      <Header />

      {/* Loading overlay */}
      {isLoadingAirports && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Airports</h3>
            <p className="text-gray-600">Preparing your flight search...</p>
          </div>
        </div>
      )}

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 sm:py-4">
        {/* Hero Section */}
        {!hasSearched && (
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-sm font-medium text-blue-800 mb-6 border border-blue-200/50">
              ✈️ Over 1M+ flights searched daily
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-gray-900 mb-2 leading-tight">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                Flight
              </span>
            </h1>
          </div>
        )}

        {/* Search Results Header */}
        {hasSearched && currentSearch && (
          <div className="mb-6 p-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                  {currentSearch.fromAirport?.city} → {currentSearch.toAirport?.city}
                </h2>
                <p className="text-sm text-gray-600">
                  {currentSearch.departDate?.toLocaleDateString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                  })}
                  {currentSearch.returnDate && (
                    <>
                      {" - "}
                      {currentSearch.returnDate.toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                      })}
                    </>
                  )}
                  {" • "}
                  {currentSearch.passengers} {currentSearch.passengers === 1 ? "passenger" : "passengers"}
                </p>
              </div>
              <button
                onClick={resetSearch}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base"
              >
                Modify Search
              </button>
            </div>
          </div>
        )}

        <SearchForm 
          onSearch={handleSearch} 
          isSearching={isSearching} 
          fullHeight={!hasSearched}
        />

        {hasSearched && (
          <SearchResults 
            isSearching={isSearching} 
            searchResults={searchResults} 
            onFlightSelect={handleFlightSelect} 
          />
        )}
      </main>
    </div>
  )
}