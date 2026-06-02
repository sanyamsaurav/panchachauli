import Image from "next/image";
import { gLite2Data } from "@/lib/product/g-lite-2";

export default function ReducedWeight() {
    const { reducedWeight } = gLite2Data;

    return (
        <section className="py-24 bg-black border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2 space-y-6">
                        <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white">
                            {reducedWeight.titleHtml}
                        </h2>
                        <p className="text-lg lg:text-xl text-slate-200 max-w-lg leading-relaxed pt-4 font-medium">
                            {reducedWeight.description}
                        </p>
                    </div>
                    <div className="lg:w-1/2 flex justify-center">
                        <Image
                            src={reducedWeight.image.src}
                            alt={reducedWeight.image.alt}
                            width={reducedWeight.image.width}
                            height={reducedWeight.image.height}
                            className="object-contain w-full drop-shadow-2xl rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
