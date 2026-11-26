import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { locales } from "@/lib/types";
import { defaultLocale } from "./locale-config";
export const routing = defineRouting({
  locales,
  defaultLocale,
  localePrefix: "as-needed",
  localeDetection: false,
  alternateLinks: false,
});
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
