"use client"

import { toast as sonnerToast } from "sonner"

/**
 * Toast utility for API responses with theme-based styling
 */
export const toast = {
  /**
   * Show success toast
   */
  success: (message: string, description?: string) => {
    return sonnerToast.success(message, {
      description,
      duration: 4000,
    })
  },

  error: (message: string, description?: string) => {
    return sonnerToast.error(message, {
      description,
      duration: 5000,
    })
  },

  warning: (message: string, description?: string) => {
    return sonnerToast.warning(message, {
      description,
      duration: 4000,
    })
  },

  info: (message: string, description?: string) => {
    return sonnerToast.info(message, {
      description,
      duration: 4000,
    })
  },

  loading: (message: string) => {
    return sonnerToast.loading(message)
  },

  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string
      success: string | ((data: T) => string)
      error: string | ((error: any) => string)
    }
  ) => {
    return sonnerToast.promise(promise, messages)
  },

  dismiss: (toastId?: string | number) => {
    sonnerToast.dismiss(toastId)
  },
}

/**
 * Handle API response and show appropriate toast
 * @param response - API response object
 * @param options - Optional configuration
 */
export function handleApiToast(
  response: {
    success: boolean
    message: string
    error?: string
  },
  options?: {
    successMessage?: string
    errorMessage?: string
    showSuccess?: boolean
    showError?: boolean
  }
) {
  const {
    successMessage,
    errorMessage,
    showSuccess = true,
    showError = true,
  } = options || {}

  if (response.success && showSuccess) {
    toast.success(successMessage || response.message)
  } else if (!response.success && showError) {
    toast.error(
      errorMessage || response.message || "An error occurred",
      response.error
    )
  }
}

