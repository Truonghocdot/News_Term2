import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category } from "./type";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, "")
    .replace(/ +/g, "-");
}

export const getCategoryOfPost = (id: number, categoriesF: Category[]): Category => {
  const categoryC =
    categoriesF.find((c: Category) => c.id === id) || categoriesF[0];
  return categoryC;
};
