"use client"

import React, { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
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

export const DatePicker = ({
  label,
  value,
  onChange,
  placeholder = "Select date",
  minDate,
  maxDate,
  className = "",
  error,
}: DatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(value || new Date())
  const [position, setPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const inputRef = useRef<HTMLDivElement>(null)

  const today = new Date()
  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })

  const selectDate = (day: number) => {
    const selected = new Date(year, month, day)
    if (minDate && selected < minDate) return
    if (maxDate && selected > maxDate) return
    onChange?.(selected)
    setIsOpen(false)
  }

  const isSelected = (day: number) =>
    value && new Date(year, month, day).toDateString() === value.toDateString()

  const isToday = (day: number) =>
    new Date(year, month, day).toDateString() === today.toDateString()

  const isDisabled = (day: number) => {
    const date = new Date(year, month, day)
    return (minDate && date < minDate) || (maxDate && date > maxDate)
  }

  const clearDate = (e: React.MouseEvent) => {
    e.stopPropagation()
    onChange?.(undefined)
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ]

  const dayNames = ["S", "M", "T", "W", "T", "F", "S"]

  useEffect(() => {
    if (isOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect()
      setPosition({
        top: rect.bottom + window.scrollY + 4,
        left: rect.left + window.scrollX,
      })
    }
  }, [isOpen])

  const CalendarPopup = () => (
    <div
      className="z-[9999] absolute bg-white shadow-2xl rounded-2xl border border-gray-200 p-4"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        position: "absolute",
      }}
    >
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1))}>
          <ChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h2 className="text-base font-bold">{monthNames[month]} {year}</h2>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1))}>
          <ChevronRight className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-gray-500">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1
          const disabled = isDisabled(day)
          const selected = isSelected(day)
          const todayClass = isToday(day)

          return (
            <button
              key={day}
              onClick={() => !disabled && selectDate(day)}
              disabled={disabled}
              className={`
                h-10 w-10 text-sm rounded-lg
                ${disabled ? "text-gray-300 cursor-not-allowed" :
                  selected ? "bg-blue-500 text-white" :
                    todayClass ? "bg-blue-100 text-blue-700 font-bold" :
                      "text-gray-700 hover:bg-gray-100"}
              `}
            >
              {day}
            </button>
          )
        })}
      </div>

      
    </div>
  )

  return (
    <div className="space-y-1">
      {label && <label className="block text-sm font-bold text-indigo-600 mb-2">{label}</label>}

      <div className="relative">
        <div
          ref={inputRef}
          className={`
            w-full px-4 py-3 rounded-xl text-sm cursor-pointer
            bg-gray-50 hover:bg-white hover:shadow-lg
            ${isOpen ? "bg-white shadow-lg ring-2 ring-blue-500/20" : ""}
            ${error ? "ring-2 ring-red-500/20 bg-red-50" : ""}
            ${className}
          `}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className={`h-5 w-5 ${isOpen ? "text-blue-500" : "text-gray-400"}`} />
              <span className={value ? "text-gray-900 font-medium" : "text-gray-400"}>
                {value ? formatDate(value) : placeholder}
              </span>
            </div>
            {value && (
              <button onClick={clearDate} className="p-1 hover:bg-gray-100 rounded-full">
                <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>

        {isOpen && typeof document !== "undefined" && createPortal(<CalendarPopup />, document.body)}
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
