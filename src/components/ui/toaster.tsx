
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props} 
            className={variant === "destructive" 
              ? "border-red-600 bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-50" 
              : "border-theme-blue-medium bg-white text-gray-900 dark:bg-slate-800 dark:text-slate-100"}
          >
            <div className="grid gap-1">
              {title && <ToastTitle className={variant === "destructive" ? "text-red-900 dark:text-red-50" : "text-gray-900 dark:text-slate-100"}>{title}</ToastTitle>}
              {description && (
                <ToastDescription className={variant === "destructive" ? "text-red-700 dark:text-red-200" : "text-gray-700 dark:text-slate-300"}>
                  {description}
                </ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
