// Core Types
export interface Airport {
  skyId: string
  entityId: string
  name: string
  iata: string
  city: string
  country: string
  type: "AIRPORT" | "CITY"
}

export interface FlightResult {
  id: string
  airline: string
  flightNumber: string
  departure: {
    airport: string
    code: string
    time: string
  }
  arrival: {
    airport: string
    code: string
    time: string
  }
  duration: string
  price: number
  stops: number
  aircraft: string
  amenities: string[]
}

// Search Parameters
export interface SearchParams {
  fromAirport: Airport | null
  toAirport: Airport | null
  departDate: Date | undefined
  returnDate: Date | undefined
  passengers: number
  tripType: string
}

export interface FlightSearchParams {
  from: string
  to: string 
  fromEntityId: string 
  toEntityId: string 
  departDate: string
  returnDate?: string
  passengers: number
  tripType: "roundtrip" | "oneway" | "multicity"
}

// Component Props
export interface SearchFormProps {
  onSearch: (params: SearchParams) => void
  isSearching?: boolean
  fullHeight?: boolean
}

export interface SearchResultsProps {
  isSearching: boolean
  searchResults: FlightResult[]
  onFlightSelect?: (flightId: string) => void
}

export interface AirportSearchProps {
  label?: string
  placeholder?: string
  value?: string
  onChange?: (airport: Airport | null) => void
  error?: string
  className?: string
}

export interface FlightCardProps {
  flight: FlightResult
  onSelect?: (flightId: string) => void
}
