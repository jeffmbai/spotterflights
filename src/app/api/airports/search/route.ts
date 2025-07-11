import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query")
    const locale = searchParams.get("locale") || "en-US"

    console.log("Airport search request:", { query, locale })

    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    if (query.length < 1) {
      return NextResponse.json({ error: "Query must be at least 1 character" }, { status: 400 })
    }

    // Load API Key
    const apiKey = process.env.RAPIDAPI_KEY || ""

    const apiUrl = `https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport?query=${encodeURIComponent(query)}&locale=${locale}`
   

    // construct payload
    const options = {
      method: "GET",
      headers: {
        "x-rapidapi-key": apiKey, 
        "x-rapidapi-host": "sky-scrapper.p.rapidapi.com", 
      },
    }

    const response = await fetch(apiUrl, options)

    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`API request failed: ${response.status} ${response.statusText}`)
      console.error("Error response body:", errorText)

      return NextResponse.json(
        {
          error: `API request failed: ${response.status} ${response.statusText}`,
          details: errorText,
          apiUrl,
          status: response.status,
        },
        { status: response.status },
      )
    }

    const data = await response.json()
    console.log(" API response received successfully")
   

    // Log first item structure if available
    if (data?.data && Array.isArray(data.data) && data.data.length > 0) {
      console.log("First airport item structure:", JSON.stringify(data.data[0], null, 2))
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Airport search error:", error)

    return NextResponse.json(
      {
        error: "Failed to search airports",
        details: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
