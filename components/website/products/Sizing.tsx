import Image from "next/image";
import { gLite2Data } from "@/lib/product/g-lite-2";

export default function Sizing() {
    const { sizing } = gLite2Data;

    return (
        <section className="py-24 bg-black border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-6">
                        <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white">
                            {sizing.titleHtml}
                        </h2>
                        {sizing.paragraphs.map((paragraph, index) => (
                            <p key={index} className="text-lg lg:text-xl text-slate-200 max-w-lg leading-relaxed pt-4 font-medium">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                    <div className="lg:w-1/2 flex justify-center">
                        <Image
                            src={sizing.image.src}
                            alt={sizing.image.alt}
                            width={sizing.image.width}
                            height={sizing.image.height}
                            className="object-contain w-full drop-shadow-2xl rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
