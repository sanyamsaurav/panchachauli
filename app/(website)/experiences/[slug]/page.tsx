import Link from "next/link";
import { getExperienceBySlug, getPublicSettings } from "@/api.services/api.services";
import { getImageUrl } from "@/lib/utils/image";
import BlogContent from "@/components/ui/common/BlogContent";
import { parsePhoneForWhatsApp, DEFAULT_PHONE } from "@/constants/site-settings";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ExperienceDetail({ params }: PageProps) {
  const { slug } = await params;

  // Fetch experience and settings in parallel
  const [experienceResult, settingsResult] = await Promise.all([
    getExperienceBySlug(slug).catch((err) => {
      console.error("Error fetching experience:", err);
      return { data: null };
    }),
    getPublicSettings().catch((err) => {
      console.error("Error fetching settings:", err);
      return { data: null };
    }),
  ]);

  const exp = experienceResult?.data;
  const settings = settingsResult?.data;

  // Handle WhatsApp link logic
  const phone = settings?.phone ? parsePhoneForWhatsApp(settings.phone) : DEFAULT_PHONE;
  // Use experience title or fallback
  const messageText = exp?.title 
    ? `Hi, I'm interested in the experience "${exp.title}". Please share details.`
    : `Hi, I'm interested in an experience. Please share details.`;
    
  const whatsappLink = `https://wa.me/${phone}?text=${encodeURIComponent(messageText)}`;

  if (!exp) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold">Experience Not Found</h1>
        <Link href="/experiences" className="text-blue-600 mt-4 inline-block">
          Back to Experiences
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[75vh] w-full overflow-hidden bg-black">
        <img
          src={getImageUrl(exp.image)}
          alt={exp.title}
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 z-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight leading-tight text-white drop-shadow-md max-w-4xl">
            {exp.title}
          </h1>
          {exp.date && (
            <p className="mt-6 text-slate-400 text-sm md:text-base">{exp.date}</p>
          )}
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16">
        <BlogContent html={exp.content} />

        <div className="flex items-center gap-4 mt-8">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 border border-black hover:bg-black hover:text-white transition cursor-pointer"
          >
            Buy Now
          </a>
          <Link
            href="/experiences"
            className="inline-block px-6 py-3 border border-black hover:bg-black hover:text-white transition cursor-pointer"
          >
            Back to Experiences
          </Link>
        </div>
      </section>
    </>
  );
}
