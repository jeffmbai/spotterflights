"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { Airport } from "../types"

interface AirportContextType {
  airports: Airport[]
  isLoading: boolean
  isReady: boolean
  searchAirports: (query: string) => Airport[]
  initialize: () => Promise<void>
}

const AirportContext = createContext<AirportContextType | undefined>(undefined)

export function useAirports() {
  const context = useContext(AirportContext)
  if (!context) {
    throw new Error("useAirports must be used within AirportProvider")
  }
  return context
}

export function AirportProvider({ children }: { children: React.ReactNode }) {
  const [airports, setAirports] = useState<Airport[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)

  const transformAirportData = (item: any): Airport => {
    const presentation = item.presentation || {}
    const navigation = item.navigation || {}
    const flightParams = navigation.relevantFlightParams || {}

    let iata = item.skyId || flightParams.skyId || "N/A"
    const suggestionTitle = presentation.suggestionTitle || ""
    const iataMatch = suggestionTitle.match(/$$([A-Z]{3})$$/)
    if (iataMatch) {
      iata = iataMatch[1]
    }

    const subtitle = presentation.subtitle || ""
    const subtitleParts = subtitle.split(",").map((s) => s.trim())
    const country = subtitleParts[subtitleParts.length - 1] || "Unknown"

    let city = subtitleParts[0] || "Unknown"
    const title = presentation.title || ""

    if (navigation.entityType === "AIRPORT" && title) {
      const titleWords = title.split(" ")
      if (titleWords.length >= 2) {
        city = titleWords.slice(0, 2).join(" ")
        if (title.includes("International") || title.includes("Airport")) {
          city = titleWords[0]
        }
      }
    }

    return {
      skyId: item.skyId || flightParams.skyId || `airport-${Date.now()}`,
      entityId: item.entityId || flightParams.entityId || `entity-${Date.now()}`,
      name: presentation.title || navigation.localizedName || flightParams.localizedName || "Unknown Airport",
      iata,
      city,
      country,
      type: navigation.entityType === "CITY" ? "CITY" : "AIRPORT",
    }
  }

  const getFallbackAirports = (): Airport[] => [
    {
      skyId: "JFK",
      entityId: "95565058",
      name: "New York John F. Kennedy",
      iata: "JFK",
      city: "New York",
      country: "United States",
      type: "AIRPORT",
    },
    {
      skyId: "LAX",
      entityId: "95565059",
      name: "Los Angeles International",
      iata: "LAX",
      city: "Los Angeles",
      country: "United States",
      type: "AIRPORT",
    }
  ]

  const initialize = async () => {
    if (isReady || isLoading) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/airports/search?query=new&locale=en-US")

      if (response.ok) {
        const data = await response.json()
        if (data.status && Array.isArray(data.data)) {
          setAirports(data.data.map(transformAirportData))
        } else {
          setAirports(getFallbackAirports())
        }
      } else {
        setAirports(getFallbackAirports())
      }

      setIsReady(true)
    } catch (error) {
      console.error("Failed to load airports:", error)
      setAirports(getFallbackAirports())
      setIsReady(true)
    } finally {
      setIsLoading(false)
    }
  }

  const searchAirports = (query: string): Airport[] => {
    if (!query || query.length < 1) return []

    const searchTerm = query.toLowerCase().trim()

    return airports
      .filter((airport) => {
        const searchableText = [airport.name, airport.iata, airport.city, airport.country, airport.skyId]
          .join(" ")
          .toLowerCase()
        return searchableText.includes(searchTerm)
      })
      .sort((a, b) => {
        if (a.iata.toLowerCase() === searchTerm) return -1
        if (b.iata.toLowerCase() === searchTerm) return 1

        const aNameMatch = a.name.toLowerCase().startsWith(searchTerm)
        const bNameMatch = b.name.toLowerCase().startsWith(searchTerm)
        if (aNameMatch && !bNameMatch) return -1
        if (!aNameMatch && bNameMatch) return 1

        return 0
      })
      .slice(0, 15)
  }

  useEffect(() => {
    initialize()
  }, [])

  return (
    <AirportContext.Provider
      value={{
        airports,
        isLoading,
        isReady,
        searchAirports,
        initialize,
      }}
    >
      {children}
    </AirportContext.Provider>
  )
}
