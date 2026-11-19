import { serviceRoute } from "@/lib/service-route";
const route = serviceRoute("tours", false);
export default route.Page;
export const generateMetadata = route.generateMetadata;
