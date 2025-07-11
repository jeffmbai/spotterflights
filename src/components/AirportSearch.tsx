"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { MapPin, X, Plane, AlertCircle, Loader2 } from "lucide-react"
import { useAirports } from "../lib/context/airport-context"
import type { Airport, AirportSearchProps } from "../lib/types"

export function AirportSearch({
  label,
  placeholder = "Search airports...",
  value = "",
  onChange,
  error,
  className = "",
}: AirportSearchProps) {
  const [query, setQuery] = useState(value)
  const [filteredAirports, setFilteredAirports] = useState<Airport[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const { searchAirports, isReady } = useAirports()

  // Update query when value prop changes
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Filter airports with debouncing
  useEffect(() => {
    if (!isReady || query.length < 1) {
      setFilteredAirports([])
      return
    }

    const timeoutId = setTimeout(() => {
      const results = searchAirports(query)
      setFilteredAirports(results)
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [query, searchAirports, isReady])

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("keydown", handleEscape)

      return () => {
        document.removeEventListener("mousedown", handleClickOutside)
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)

    if (!newQuery.trim()) {
      onChange?.(null)
      setIsOpen(false)
    } else if (isReady) {
      setIsOpen(true)
    }
  }

  const handleAirportSelect = (airport: Airport) => {
    setQuery(`${airport.name} (${airport.iata})`)
    setIsOpen(false)
    onChange?.(airport)
  }

  const handleClear = () => {
    setQuery("")
    setIsOpen(false)
    onChange?.(null)
    inputRef.current?.focus()
  }

  const handleFocus = () => {
    if (isReady && query.length >= 1 && filteredAirports.length > 0) {
      setIsOpen(true)
    }
  }

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}

      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400 z-10" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          className={`w-full text-black pl-10 pr-10 py-3 rounded-xl text-sm transition-all duration-200 bg-gray-50 border-0 hover:bg-white hover:shadow-lg focus:bg-white focus:shadow-lg focus:ring-2 focus:ring-blue-500/20 focus:outline-none ${
            error ? "ring-2 ring-red-500/20 bg-red-50" : ""
          } ${className}`}
          autoComplete="off"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-3 p-0.5 hover:bg-gray-100 rounded-full transition-colors z-10"
            type="button"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}

        {/* Dropdown */}
        {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-[100] min-w-[400px] sm:min-w-[500px] lg:min-w-[600px]">
             {!isReady && (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600 mr-3" />
                <span className="text-sm text-gray-600 font-medium">Loading airports...</span>
              </div>
            )}

            {isReady && filteredAirports.length === 0 && query.length >= 1 && (
              <div className="flex items-center justify-center py-8 text-gray-500">
                <AlertCircle className="h-6 w-6 mr-3" />
                <div className="text-center">
                  <div className="text-sm font-medium">No airports found</div>
                  <div className="text-xs text-gray-400 mt-1">Try a different search term</div>
                </div>
              </div>
            )}

            {isReady && filteredAirports.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50">
                  {filteredAirports.length} result{filteredAirports.length !== 1 ? "s" : ""}
                </div>
                {filteredAirports.map((airport, index) => (
                  <button
                    key={`${airport.skyId}-${index}`}
                    onClick={() => handleAirportSelect(airport)}
                    className="w-full text-left px-4 py-4 hover:bg-blue-50 transition-colors border-b border-gray-50 last:border-b-0 group"
                    type="button"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:from-blue-200 group-hover:to-indigo-200 transition-colors">
                        {airport.type === "CITY" ? (
                          <MapPin className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Plane className="h-6 w-6 text-blue-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate group-hover:text-blue-900 text-base">
                          {airport.name}
                        </div>
                        <div className="text-sm text-gray-500 truncate mt-0.5">
                          {airport.city}, {airport.country}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                            {airport.iata}
                          </span>
                          <span className="text-xs text-gray-400">
                            {airport.type === "CITY" ? "All airports" : "Airport"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
          <span className="w-1 h-1 bg-red-500 rounded-full"></span>
          {error}
        </p>
      )}
    </div>
  )
}
