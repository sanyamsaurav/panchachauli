"use client";

import * as React from "react";
import { Input as ShadcnInput } from "@/components/ui/input";
import { cn } from "@/utils/cn";
import { Eye, EyeOff } from "lucide-react";

type InputSize = "default" | "sm" | "lg";
type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search"
  | "date"
  | "time"
  | "datetime-local";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: InputSize;
  type?: InputType;
  className?: string;
  autoRemove?: boolean; // Auto remove non-numeric characters for number inputs
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>( (props: InputProps, ref: React.Ref<HTMLInputElement>) => {

    const {
      label,
      error,
      helperText,
      size = "default",
      type = "text",
      className,
      autoRemove = false,
      required = false,
      disabled = false,
      placeholder,
      onChange,
      ...rest
    } = props;

    const [showPassword, setShowPassword] = React.useState(false);
    const isPasswordType = type === "password";

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
    
      if (type === "number" || autoRemove) {
        newValue = newValue.replace(/[^0-9.]/g, "");
        const parts = newValue.split(".");
        if (parts.length > 2) {
          newValue = parts[0] + "." + parts.slice(1).join("");
        }
      }
    
      if (type === "tel") {
        newValue = newValue.replace(/\s/g, "");
      }
    
      e.target.value = newValue;
    
      onChange?.(e);   // ⭐ RHF original handler
    };
    
    

    const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const hasError = !!error;
    const inputVariant = hasError ? "error" : "default";
    const displayType = isPasswordType ? (showPassword ? "text" : "password") : (type === "number" ? "text" : type);

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "block text-sm font-semibold text-gray-900 mb-2",
              required && "after:content-['*'] after:ml-0.5 after:text-red-500"
            )}
          >
            {label}
          </label>
        )}

        <div className="relative">
        <ShadcnInput
  {...rest}          // ⭐ spread FIRST
  id={inputId}
  ref={ref}
  type={displayType}
  className={cn(className, isPasswordType && "pr-10")}
  onChange={handleChange}   // ⭐ override AFTER spread
  required={required}
  disabled={disabled}
  placeholder={placeholder}
  aria-invalid={!!error}
  aria-describedby={
    error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
  }
/>

          {isPasswordType && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          )}
        </div>

        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-2 text-sm text-gray-500">
            {helperText}
          </p>
        )}

        {error && (
          <p id={`${inputId}-error`} className="mt-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;

