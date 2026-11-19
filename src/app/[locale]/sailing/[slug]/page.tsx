import { serviceRoute } from "@/lib/service-route";
const route = serviceRoute("sailing", true);
export default route.Page;
export const generateMetadata = route.generateMetadata;
