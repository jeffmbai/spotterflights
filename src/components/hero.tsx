import { Zap } from "lucide-react"

export function HeroSection() {
  return (
    <div className="text-center mb-12 sm:mb-16 lg:mb-20 relative px-4 sm:px-0">
      <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full text-xs sm:text-sm font-medium text-blue-800 mb-4 sm:mb-6 border border-blue-200/50">
        <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
        Over 1M+ flights searched daily
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight px-4 sm:px-0">
        Discover Your Next
        <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mt-2 sm:mt-0">
          Flight
        </span>
      </h1>

      <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto mb-6 sm:mb-8 leading-relaxed px-4 sm:px-0">
        Search and compare flights from hundreds of airlines worldwide.
        <span className="block mt-1 sm:mt-2 font-medium text-gray-700">
          Find the perfect journey at unbeatable prices.
        </span>
      </p>

      {/* Stats */}
      <div className="flex flex-wrap justify-center gap-4 sm:gap-6 lg:gap-8 mb-8 sm:mb-12 px-4 sm:px-0">
        <div className="text-center min-w-[80px] sm:min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">500+</div>
          <div className="text-xs sm:text-sm text-gray-600">Airlines</div>
        </div>
        <div className="text-center min-w-[80px] sm:min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-bold text-indigo-600">1000+</div>
          <div className="text-xs sm:text-sm text-gray-600">Destinations</div>
        </div>
        <div className="text-center min-w-[80px] sm:min-w-[100px]">
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">24/7</div>
          <div className="text-xs sm:text-sm text-gray-600">Support</div>
        </div>
      </div>
    </div>
  )
}
