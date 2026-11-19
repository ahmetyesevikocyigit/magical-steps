import { serviceRoute } from "@/lib/service-route";
const route = serviceRoute("transfers", false);
export default route.Page;
export const generateMetadata = route.generateMetadata;
