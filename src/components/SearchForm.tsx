"use client"

import type React from "react"
import { useState } from "react"
import { Search, ArrowLeftRight, MapPin, Users, Plane } from "lucide-react"
import { DatePicker } from "./ui/calender"
import { SimpleInput } from "./ui/input"


interface SearchParams {
  from: string
  to: string
  departDate: Date | undefined
  returnDate: Date | undefined
  passengers: number
  tripType: string
}

interface SearchProps {
  onSearch: (params: SearchParams) => void
  isSearching?: boolean
}

export function SearchForm({ onSearch, isSearching = false }: SearchProps) {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    from: "",
    to: "",
    departDate: undefined,
    returnDate: undefined,
    passengers: 1,
    tripType: "roundtrip",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    const newErrors: Record<string, string> = {}
    if (!searchParams.from) newErrors.from = "Origin is required"
    if (!searchParams.to) newErrors.to = "Destination is required"
    if (!searchParams.departDate) newErrors.departDate = "Departure date is required"
    if (searchParams.tripType === "roundtrip" && !searchParams.returnDate) {
      newErrors.returnDate = "Return date is required for round trip"
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSearch(searchParams)
    }
  }

  const swapAirports = () => {
    setSearchParams((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from,
    }))
    // Clear errors for swapped fields
    setErrors((prev) => ({
      ...prev,
      from: "",
      to: "",
    }))
  }

  const handleInputChange = (field: keyof SearchParams, value: string | number | Date | undefined) => {
    setSearchParams((prev) => ({
      ...prev,
      [field]: value,
    }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <Plane className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold">Search Flights</h2>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name="tripType"
                  value="roundtrip"
                  checked={searchParams.tripType === "roundtrip"}
                  onChange={(e) => handleInputChange("tripType", e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white/60 flex items-center justify-center transition-all ${
                    searchParams.tripType === "roundtrip" ? "border-white bg-white" : "group-hover:border-white/80"
                  }`}
                >
                  {searchParams.tripType === "roundtrip" && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                </div>
              </div>
              <span className="font-medium">Round trip</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="radio"
                  name="tripType"
                  value="oneway"
                  checked={searchParams.tripType === "oneway"}
                  onChange={(e) => handleInputChange("tripType", e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`w-5 h-5 rounded-full border-2 border-white/60 flex items-center justify-center transition-all ${
                    searchParams.tripType === "oneway" ? "border-white bg-white" : "group-hover:border-white/80"
                  }`}
                >
                  {searchParams.tripType === "oneway" && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                </div>
              </div>
              <span className="font-medium">One way</span>
            </label>

            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-white/80" />
              <select
                value={searchParams.passengers}
                onChange={(e) => handleInputChange("passengers", Number(e.target.value))}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-1 text-white font-medium focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num} className="text-gray-900">
                    {num} {num === 1 ? "passenger" : "passengers"}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSubmit} className="p-6 z-40">
          {/* Desktop Layout */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-6 mb-4">
            <SimpleInput
              label="From"
              placeholder="New York (JFK)"
              value={searchParams.from}
              onChange={(e) => handleInputChange("from", e.target.value)}
              icon={<MapPin className="h-5 w-5" />}
              error={errors.from}
              
            />

            <div className="flex items-end justify-center pb-4">
              <button
                type="button"
                onClick={swapAirports}
                className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 rounded-xl transition-all duration-200 transform hover:scale-105 group"
              >
                <ArrowLeftRight className="h-5 w-5 text-blue-600 group-hover:text-blue-700" />
              </button>
            </div>

            <SimpleInput
              label="To"
              placeholder="Los Angeles (LAX)"
              value={searchParams.to}
              onChange={(e) => handleInputChange("to", e.target.value)}
              icon={<MapPin className="h-5 w-5" />}
              error={errors.to}
              
            />

            <DatePicker
              label="Departure"
              value={searchParams.departDate}
              onChange={(date) => handleInputChange("departDate", date)}
              minDate={today}
              error={errors.departDate}
              placeholder="Select departure"
            />

            {searchParams.tripType === "roundtrip" && (
              <DatePicker
                label="Return"
                value={searchParams.returnDate}
                onChange={(date) => handleInputChange("returnDate", date)}
                minDate={searchParams.departDate || tomorrow}
                error={errors.returnDate}
                placeholder="Select return"
              />
            )}
          </div>

          {/* Mobile Layout */}
          <div className="lg:hidden space-y-6 mb-8">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-3 items-end">
              <SimpleInput
                label="From"
                placeholder="NYC"
                value={searchParams.from}
                onChange={(e) => handleInputChange("from", e.target.value)}
                icon={<MapPin className="h-4 w-4" />}
                error={errors.from}
               
              />

              <button
                type="button"
                onClick={swapAirports}
                className="p-3 bg-gradient-to-r from-blue-100 to-indigo-100 hover:from-blue-200 hover:to-indigo-200 rounded-xl transition-all duration-200 mb-6"
              >
                <ArrowLeftRight className="h-4 w-4 text-blue-600" />
              </button>

              <SimpleInput
                label="To"
                placeholder="LAX"
                value={searchParams.to}
                onChange={(e) => handleInputChange("to", e.target.value)}
                icon={<MapPin className="h-4 w-4" />}
                error={errors.to}
                
              />
            </div>

            <div className={`grid ${searchParams.tripType === "roundtrip" ? "grid-cols-2" : "grid-cols-1"} gap-4 z-50`}>
              <DatePicker
                label="Departure"
                value={searchParams.departDate}
                onChange={(date) => handleInputChange("departDate", date)}
                minDate={today}
                error={errors.departDate}
                placeholder="Departure"
              />

              {searchParams.tripType === "roundtrip" && (
                <DatePicker
                  label="Return"
                  value={searchParams.returnDate}
                  onChange={(date) => handleInputChange("returnDate", date)}
                  minDate={searchParams.departDate || tomorrow}
                  error={errors.returnDate}
                  placeholder="Return"
                />
              )}
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            disabled={isSearching}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
          >
            <Search className="h-6 w-6" />
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Searching flights...
              </>
            ) : (
              "Search flights"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
