import HomePage from "@/components/website/Home";
import { getCityBySlug } from "@/lib/data/cities";

export default async function FlyCityPage({ params }: { params: Promise<{ city: string }> }) {
    const resolvedParams = await params;
    const citySlug = resolvedParams.city || "panchachuli";
    const cityData = getCityBySlug(citySlug);

    return <HomePage cityData={cityData} />;
}
