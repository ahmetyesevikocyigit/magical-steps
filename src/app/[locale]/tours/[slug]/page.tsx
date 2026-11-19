import { serviceRoute } from "@/lib/service-route";
const route = serviceRoute("tours", true);
export default route.Page;
export const generateMetadata = route.generateMetadata;
