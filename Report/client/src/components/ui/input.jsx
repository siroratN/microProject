// src/components/ui/input.jsx
import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "mx-8 flex h-10 w-full max-w-xl rounded-md border border-gray-300 bg-[#F7F7F7] px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"

export { Input }