import { serviceRoute } from "@/lib/service-route";
const route = serviceRoute("transfers", true);
export default route.Page;
export const generateMetadata = route.generateMetadata;
