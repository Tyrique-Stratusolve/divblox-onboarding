import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { toast } from 'svelte-sonner';

export function cn(...inputs) {
 return twMerge(clsx(inputs));
}

export function withErrorToast(promise, message) {
  return promise.catch(error => {
    toast.error(message || error.message || 'Something went wrong');
  });
}