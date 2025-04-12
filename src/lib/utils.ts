import {clsx, type ClassValue} from "clsx"
import {twMerge} from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const getExplorerUrl = (hash: string, type: 'ipa' | "address" = 'ipa') => {
    return `https://aeneid.explorer.story.foundation/${type}/${hash}`
}