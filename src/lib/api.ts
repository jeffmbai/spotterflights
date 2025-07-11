import type { FlightSearchParams, FlightResult, Airport } from "./types"

// Search airports 
export async function searchAirports(query: string): Promise<Airport[]> {
  try {
    if (!query || query.length < 2) {
      console.log("Query too short, returning empty results")
      return []
    }

    const apiUrl = `/api/airports/search?query=${encodeURIComponent(query)}&locale=en-US`
   

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
      console.error("API request failed:", errorData)
      throw new Error(`API request failed: ${response.status} - ${errorData.error || response.statusText}`)
    }

    const apiResponse = await response.json()
 

    // Handle Sky Scrapper API response format
    let airports: Airport[] = []

    if (apiResponse.status === true && Array.isArray(apiResponse.data)) {
      console.log("✅ Processing Sky Scrapper API format with", apiResponse.data.length, "items")

      airports = apiResponse.data.map((item: any, index: number) => {
        console.log(`Processing item ${index + 1}:`, JSON.stringify(item, null, 2))

        const presentation = item.presentation || {}
        const navigation = item.navigation || {}
        const flightParams = navigation.relevantFlightParams || {}

        // Extract IATA code from suggestionTitle or skyId
        let iata = item.skyId || flightParams.skyId || "N/A"
        const suggestionTitle = presentation.suggestionTitle || ""
        const iataMatch = suggestionTitle.match(/$$([A-Z]{3})$$/)
        if (iataMatch) {
          iata = iataMatch[1]
        }

        // Extract city and country from subtitle
        const subtitle = presentation.subtitle || ""
        const subtitleParts = subtitle.split(",").map((s) => s.trim())
        const country = subtitleParts[subtitleParts.length - 1] || "Unknown"

        // Extract city from title or subtitle
        let city = subtitleParts[0] || "Unknown"
        const title = presentation.title || ""

        // For airports, try to extract city from the beginning of the title
        if (navigation.entityType === "AIRPORT" && title) {
          // Handle formats like "New York John F. Kennedy" -> "New York"
          const titleWords = title.split(" ")
          if (titleWords.length >= 2) {
            // Take first 1-2 words as city name
            city = titleWords.slice(0, 2).join(" ")
            // If it looks like an airport name,
            if (title.includes("International") || title.includes("Airport")) {
              city = titleWords[0]
            }
          }
        }

        const airport: Airport = {
          skyId: item.skyId || flightParams.skyId || `airport-${index}`,
          entityId: item.entityId || flightParams.entityId || `entity-${index}`,
          name: presentation.title || navigation.localizedName || flightParams.localizedName || "Unknown Airport",
          iata: iata,
          city: city,
          country: country,
          type: navigation.entityType === "CITY" ? "CITY" : "AIRPORT",
        }

        console.log(`Processed airport ${index + 1}:`, airport)
        return airport
      })
    } else {
      console.error("Unexpected API response format:", apiResponse)
      return []
    }

    console.log(`Successfully processed ${airports.length} airports`)
    return airports
  } catch (error) {
    console.error(" Airport search error:", error)

    // Return mock data for testing
    console.log(" Returning mock data as fallback")
    return []
  }
}

// Search flights with proper airport data
export async function searchFlights(params: FlightSearchParams): Promise<FlightResult[]> {
  try {
    const searchPayload = {
      originSkyId: params.from,
      destinationSkyId: params.to,
      originEntityId: params.fromEntityId, 
      destinationEntityId: params.toEntityId,
      date: params.departDate,
      returnDate: params.returnDate,
      adults: params.passengers,
      cabinClass: "economy",
      sortBy: "best",
      currency: "USD",
      market: "en-US",
      countryCode: "US",
    }

    const response = await fetch("/api/flights/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchPayload),
    })

    if (!response.ok) {
      throw new Error("Failed to search flights")
    }

    const data = await response.json()
    return data.flights || []
  } catch (error) {
    console.error("Flight search error:", error)
    throw error
  }
}

