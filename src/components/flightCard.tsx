"use client"

import { Plane, Clock, Wifi, Coffee, Star, Luggage, MapPin } from "lucide-react"
import { Button } from "./ui/button"
import { FlightCardProps } from "../lib/types"


export function FlightCard({ flight, onSelect }: FlightCardProps) {
  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return <Wifi className="h-3 w-3 sm:h-4 sm:w-4" />
      case "entertainment":
        return <Star className="h-3 w-3 sm:h-4 sm:w-4" />
      case "meals":
        return <Coffee className="h-3 w-3 sm:h-4 sm:w-4" />
      default:
        return <Luggage className="h-3 w-3 sm:h-4 sm:w-4" />
    }
  }

  const getAmenityColor = (amenity: string) => {
    switch (amenity) {
      case "wifi":
        return "bg-blue-100 text-blue-600"
      case "entertainment":
        return "bg-purple-100 text-purple-600"
      case "meals":
        return "bg-orange-100 text-orange-600"
      default:
        return "bg-green-100 text-green-600"
    }
  }

  return (
    <div className="hover:shadow-2xl transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm transform hover:scale-[1.02] group mx-4 sm:mx-0 overflow-hidden rounded-2xl">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        {/* Header with airline and price */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
              <Plane className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-gray-900 text-base sm:text-lg">{flight.airline}</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium">{flight.flightNumber}</div>
              <div className="text-xs text-gray-400">{flight.aircraft}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ${flight.price}
            </div>
            <div className="text-xs sm:text-sm text-gray-500 font-medium">per person</div>
          </div>
        </div>

        {/* Flight route and timing */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-center mb-4">
            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-gray-900">{flight.departure.time}</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium flex items-center justify-center gap-1">
                <MapPin className="h-3 w-3" />
                {flight.departure.code}
              </div>
              <div className="text-xs text-gray-400 mt-1 hidden sm:block truncate">{flight.departure.airport}</div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 sm:space-x-2 mb-1 sm:mb-2">
                <div className="h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 flex-1 rounded"></div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </div>
                <div className="h-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 flex-1 rounded"></div>
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium">{flight.duration}</div>
              <div className="text-xs text-gray-400 mt-1">
                {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
              </div>
            </div>

            <div className="text-center">
              <div className="text-lg sm:text-xl font-bold text-gray-900">{flight.arrival.time}</div>
              <div className="text-xs sm:text-sm text-gray-500 font-medium flex items-center justify-center gap-1">
                <MapPin className="h-3 w-3" />
                {flight.arrival.code}
              </div>
              <div className="text-xs text-gray-400 mt-1 hidden sm:block truncate">{flight.arrival.airport}</div>
            </div>
          </div>

          {/* Amenities and action */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex space-x-2">
              {flight.amenities.slice(0, 4).map((amenity, index) => (
                <div
                  key={index}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${getAmenityColor(amenity)}`}
                  title={amenity}
                >
                  {getAmenityIcon(amenity)}
                </div>
              ))}
              {flight.amenities.length > 4 && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">+{flight.amenities.length - 4}</span>
                </div>
              )}
            </div>
            <Button
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 sm:py-3 sm:px-6 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 text-sm"
              onClick={() => onSelect?.(flight.id)}
            >
              Select
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block p-6 lg:p-8">
        <div className="flex items-center justify-between gap-6">
          <div className="flex-1 flex items-center space-x-8">
            {/* Airline Info */}
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-gray-900 text-lg truncate">{flight.airline}</div>
                <div className="text-sm text-gray-500 font-medium">{flight.flightNumber}</div>
                <div className="text-xs text-gray-400">{flight.aircraft}</div>
              </div>
            </div>

            {/* Flight Details */}
            <div className="flex-1 grid grid-cols-3 gap-6 items-center min-w-0">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{flight.departure.time}</div>
                <div className="text-sm text-gray-500 font-medium flex items-center justify-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {flight.departure.code}
                </div>
                <div className="text-xs text-gray-400 mt-1 truncate">{flight.departure.airport}</div>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 mb-2">
                  <div className="h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400 flex-1 rounded"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="h-0.5 bg-gradient-to-r from-indigo-400 to-blue-400 flex-1 rounded"></div>
                </div>
                <div className="text-sm text-gray-600 font-medium">{flight.duration}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                </div>
              </div>

              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{flight.arrival.time}</div>
                <div className="text-sm text-gray-500 font-medium flex items-center justify-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {flight.arrival.code}
                </div>
                <div className="text-xs text-gray-400 mt-1 truncate">{flight.arrival.airport}</div>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex space-x-3 flex-shrink-0">
              {flight.amenities.slice(0, 4).map((amenity, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${getAmenityColor(amenity)}`}
                  title={amenity}
                >
                  {getAmenityIcon(amenity)}
                </div>
              ))}
              {flight.amenities.length > 4 && (
                <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">+{flight.amenities.length - 4}</span>
                </div>
              )}
            </div>
          </div>

          {/* Price and Book */}
          <div className="text-center lg:text-right flex-shrink-0">
            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ${flight.price}
            </div>
            <div className="text-sm text-gray-500 mb-4 font-medium">per person</div>
            <Button
              className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              onClick={() => onSelect?.(flight.id)}
            >
              Select flight
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
