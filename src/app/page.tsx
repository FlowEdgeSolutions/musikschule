import SchnittkeAkademie from "@/components/schnittke/SchnittkeAkademie";
import { getCmsData } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const cmsData = await getCmsData();

  return <SchnittkeAkademie cmsData={cmsData} />;
}
