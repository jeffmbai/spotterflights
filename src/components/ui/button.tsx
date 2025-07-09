"use client"

import * as React from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
  size?: "default" | "sm"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", children, ...props }, ref) => {
    const variantStyles =
      variant === "outline"
        ? "bg-white border border-gray-300 text-gray-800 hover:bg-gray-50"
        : "bg-blue-600 text-white hover:bg-blue-700"

    const sizeStyles =
      size === "sm"
        ? "h-9 px-3 text-sm"
        : "h-10 px-4 text-sm"

    const baseStyles =
      "inline-flex items-center justify-center rounded-md font-medium disabled:opacity-50 disabled:cursor-not-allowed"

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`.trim()}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = "Button"

export { Button }
