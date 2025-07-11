"use client"
import { Filter, SlidersHorizontal } from "lucide-react"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { FlightCard } from "./flightCard"
import { SearchResultsProps } from "../lib/types"

export function SearchResults({ isSearching, searchResults, onFlightSelect }: SearchResultsProps) {
  if (isSearching) {
    return (
      <div className="flex flex-col items-center justify-center py-16 sm:py-20 px-4">
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-4 border-blue-600 border-t-transparent absolute top-0"></div>
        </div>
        <div className="text-center">
          <p className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Searching for flights...</p>
          <p className="text-sm sm:text-base text-gray-600">We are comparing prices from hundreds of airlines</p>
        </div>
      </div>
    )
  }

  if (searchResults.length === 0) {
    return (
      <div className="text-center py-6 sm:py-10 px-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Filter className="h-8 w-8 sm:h-10 sm:w-10 text-gray-400" />
        </div>
        <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">No flights found</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          We could not find any flights matching your search criteria. Try adjusting your dates or destinations.
        </p>
        <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent">
          Modify Search
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8 mt-8">
      {/* Results header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {searchResults.length} flight{searchResults.length !== 1 ? "s" : ""} found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Best deals from top airlines</p>
        </div>

        <div className="flex gap-3">
          {/* Mobile filter button */}
          <Button variant="outline" className="sm:hidden flex items-center gap-2 bg-transparent">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>

          {/* Sort dropdown */}
          <Select defaultValue="price">
            <SelectTrigger className="w-full sm:w-48 border-gray-200">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price">Best price</SelectItem>
              <SelectItem value="duration">Shortest duration</SelectItem>
              <SelectItem value="departure">Departure time</SelectItem>
              <SelectItem value="arrival">Arrival time</SelectItem>
              <SelectItem value="airline">Airline</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Quick filters */}
      <div className="flex gap-2 overflow-x-auto pb-2 px-4 sm:px-0 scrollbar-hide">
        <Button variant="outline" size="sm" className="whitespace-nowrap bg-transparent">
          Nonstop only
        </Button>
        <Button variant="outline" size="sm" className="whitespace-nowrap bg-transparent">
          Under $300
        </Button>
        <Button variant="outline" size="sm" className="whitespace-nowrap bg-transparent">
          Morning departure
        </Button>
        <Button variant="outline" size="sm" className="whitespace-nowrap bg-transparent">
          Free WiFi
        </Button>
        <Button variant="outline" size="sm" className="whitespace-nowrap bg-transparent">
          Refundable
        </Button>
      </div>

      {/* Flight results */}
      <div className="space-y-4 sm:space-y-6">
        {searchResults.map((flight, index) => (
          <div
            key={flight.id}
            className="animate-in fade-in-0 slide-in-from-bottom-4 duration-300"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <FlightCard flight={flight} onSelect={onFlightSelect} />
          </div>
        ))}
      </div>

      {/* Load more button */}
      {searchResults.length >= 10 && (
        <div className="text-center pt-8">
          <Button variant="outline" className="px-8 py-3 bg-transparent">
            Load more flights
          </Button>
        </div>
      )}
    </div>
  )
}
