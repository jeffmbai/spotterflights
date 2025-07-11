"use client"

import * as React from "react"
import { Calendar, X, ChevronLeft, ChevronRight } from "lucide-react"

interface DatePickerProps {
  label?: string
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  minDate?: Date
  maxDate?: Date
  className?: string
  error?: string
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
  className = "",
  error,
}: DatePickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [currentMonth, setCurrentMonth] = React.useState(value || new Date())

  const containerRef = React.useRef<HTMLDivElement>(null)

  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"]

  // Handle outside clicks
  React.useEffect(() => {
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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  const selectDate = (day: number) => {
    const selectedDate = new Date(year, month, day)

    if (minDate && selectedDate < minDate) return
    if (maxDate && selectedDate > maxDate) return

    onChange?.(selectedDate)
    setIsOpen(false)
  }

  const isSelected = (day: number) => {
    if (!value) return false
    const date = new Date(year, month, day)
    return date.toDateString() === value.toDateString()
  }

  const isToday = (day: number) => {
    const date = new Date(year, month, day)
    return date.toDateString() === today.toDateString()
  }

  const isDisabled = (day: number) => {
    const date = new Date(year, month, day)
    if (minDate && date < minDate) return true
    if (maxDate && date > maxDate) return true
    return false
  }

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(undefined)
  }

  const selectToday = () => {
    if (minDate && today < minDate) return
    if (maxDate && today > maxDate) return
    onChange?.(today)
    setIsOpen(false)
  }

  return (
    <div className="space-y-1 relative" ref={containerRef}>
      {label && <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>}

      <div className="relative">
        <div
          className={`w-full px-4 py-3 rounded-xl text-sm transition-all duration-200 cursor-pointer bg-gray-50 border-0 hover:bg-white hover:shadow-lg ${
            isOpen ? "bg-white shadow-lg ring-2 ring-blue-500/20" : ""
          } ${error ? "ring-2 ring-red-500/20 bg-red-50" : ""} ${className}`}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className={`h-5 w-5 transition-colors ${isOpen ? "text-blue-500" : "text-gray-400"}`} />
              <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
                {value ? formatDate(value) : placeholder}
              </span>
            </div>

            {value && (
              <button
                onClick={clearDate}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                type="button"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {/* Calendar Dropdown */}
        {isOpen && (
         <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-[100] min-w-[350px] sm:min-w-[400px] lg:min-w-[450px]">
           <div className="p-4 md:p-6">
              {/* Calendar header */}
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <button
                  onClick={previousMonth}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
                  type="button"
                >
                  <ChevronLeft className="h-4 w-4 md:h-5 md:w-5 text-gray-600 group-hover:text-gray-900" />
                </button>

                <div className="text-center">
                  <h2 className="text-base md:text-lg font-bold text-gray-900">
                    {monthNames[month]} {year}
                  </h2>
                </div>

                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors group"
                  type="button"
                >
                  <ChevronRight className="h-4 w-4 md:h-5 md:w-5 text-gray-600 group-hover:text-gray-900" />
                </button>
              </div>

              {/* Day names */}
              <div className="grid grid-cols-7 gap-1 mb-2 md:mb-3">
                {dayNames.map((day) => (
                  <div key={day} className="text-center py-1 md:py-2">
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{day}</span>
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1 mb-4 md:mb-6">
                {/* Empty cells for days before month starts */}
                {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="h-8 md:h-10" />
                ))}

                {/* Days of the month */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const selected = isSelected(day)
                  const todayClass = isToday(day)
                  const disabled = isDisabled(day)

                  let dayStyles = `h-8 w-8 md:h-10 md:w-10 flex items-center justify-center text-xs md:text-sm font-medium rounded-lg md:rounded-xl transition-all duration-200 cursor-pointer`

                  if (disabled) {
                    dayStyles += " text-gray-300 cursor-not-allowed"
                  } else if (selected) {
                    dayStyles +=
                      " bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105"
                  } else if (todayClass) {
                    dayStyles += " bg-blue-100 text-blue-700 font-bold hover:bg-blue-200"
                  } else {
                    dayStyles += " text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }

                  return (
                    <button
                      key={day}
                      onClick={() => !disabled && selectDate(day)}
                      disabled={disabled}
                      className={dayStyles}
                      type="button"
                    >
                      {day}
                    </button>
                  )
                })}
              </div>

              {/* Footer */}
              <div className="pt-3 md:pt-4 border-t border-gray-100">
                <div className="flex gap-2">
                  <button
                    onClick={selectToday}
                    className="flex-1 py-2 px-4 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors disabled:text-gray-400 disabled:cursor-not-allowed"
                    disabled={(minDate && today < minDate) || (maxDate && today > maxDate)}
                    type="button"
                  >
                    Today
                  </button>
                </div>
              </div>
            </div>
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
