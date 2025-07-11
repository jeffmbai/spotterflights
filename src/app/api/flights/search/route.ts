import { Itinerary } from "@/src/lib/types"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      originSkyId,
      destinationSkyId,
      originEntityId,
      destinationEntityId,
      date,
      returnDate,
      cabinClass = "economy",
      adults = 1,
      sortBy = "best",
      currency = "USD",
      market = "en-US",
      countryCode = "US",
    } = body

    if (!originSkyId || !destinationSkyId || !date) {
      return NextResponse.json(
        {
          error: "originSkyId, destinationSkyId, and date are required",
        },
        { status: 400 },
      )
    }


    const apiKey = process.env.RAPIDAPI_KEY || ""

    // Build query parameters 
    const params = new URLSearchParams({
      originSkyId,
      destinationSkyId,
      originEntityId, 
      destinationEntityId,
      date,
      cabinClass,
      adults: adults.toString(),
      sortBy,
      currency,
      market,
      countryCode,
    })

    if (returnDate) {
      params.append("returnDate", returnDate)
    }

    
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com",
      },
    }

    const apiUrl = `https://sky-scrapper.p.rapidapi.com/api/v2/flights/searchFlights?${params.toString()}`


    const response = await fetch(apiUrl, options)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API request failed: ${response.status} ${response.statusText}`)
      console.error("Error response:", errorText)
      throw new Error(`API request failed: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    // Transform the API
    const transformedFlights =
      data.data?.itineraries?.map((itinerary:Itinerary, index: number) => {
        const firstLeg = itinerary.legs?.[0]
        const lastLeg = itinerary.legs?.[itinerary.legs.length - 1]

        return {
          id: `flight-${index}`,
          airline: firstLeg?.carriers?.marketing?.[0]?.name || "Unknown Airline",
          flightNumber: firstLeg?.segments?.[0]?.flightNumber || "N/A",
          departure: {
            airport: firstLeg?.origin?.name || "Unknown Airport",
            code: firstLeg?.origin?.displayCode || "N/A",
            time: firstLeg?.departure
              ? new Date(firstLeg.departure).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "N/A",
          },
          arrival: {
            airport: lastLeg?.destination?.name || "Unknown Airport",
            code: lastLeg?.destination?.displayCode || "N/A",
            time: lastLeg?.arrival
              ? new Date(lastLeg.arrival).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
              : "N/A",
          },
          duration: itinerary.durationInMinutes
            ? `${Math.floor(itinerary.durationInMinutes / 60)}h ${itinerary.durationInMinutes % 60}m`
            : "N/A",
          price: itinerary.price?.raw || 0,
          stops: (itinerary.legs?.length || 1) - 1,
          aircraft: firstLeg?.segments?.[0]?.aircraft?.name || "Unknown Aircraft",
          amenities: ["wifi", "entertainment"], 
        }
      }) || []

    return NextResponse.json({ flights: transformedFlights })
  } catch (error) {
    console.error("Flight search error:", error)

    // Return mock data as fallback
    const mockResponse = {
      flights: [],
    }

    return NextResponse.json(mockResponse)
  }
}
