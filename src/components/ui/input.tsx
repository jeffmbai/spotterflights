"use client"

import * as React from "react"

interface SimpleInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: React.ReactNode
  error?: string
}

const SimpleInput = React.forwardRef<HTMLInputElement, SimpleInputProps>(
  ({ className = "", label, icon, error, ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && <label className="block text-sm font-bold text-indigo-600">{label}</label>}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-2 rounded-lg border text-sm text-black
              ${icon ? "pl-10" : ""}
              ${error ? "border-red-500" : "border-gray-300"}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    )
  }
)

SimpleInput.displayName = "SimpleInput"

export { SimpleInput }
