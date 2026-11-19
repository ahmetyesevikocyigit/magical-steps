import ContentRoute, {
  generateMetadata as contentMetadata,
} from "@/app/[locale]/[...segments]/page";
import type { Locale } from "./types";

type Props = {
  params: Promise<{ locale: Locale; slug?: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function serviceRoute(root: string, detail = false) {
  const resolve = ({ params, searchParams }: Props) => ({
    params: params.then(({ locale, slug }) => ({
      locale,
      segments: detail ? [root, slug!] : [root],
    })),
    searchParams,
  });
  return {
    Page: (props: Props) => ContentRoute(resolve(props)),
    generateMetadata: (props: Props) => contentMetadata(resolve(props)),
  };
}
