import { serviceRoute } from "@/lib/service-route";
const route = serviceRoute("hotels", true);
export default route.Page;
export const generateMetadata = route.generateMetadata;
