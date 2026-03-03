import { getApiDocs } from "@/lib/swagger";
import SwaggerProvider from "@/../components/SwaggerUI";
export default async function IndexPage() {
 const spec = await getApiDocs();
 return (
   <section className="container">
     <SwaggerProvider spec={spec} />
   </section>
 );
}