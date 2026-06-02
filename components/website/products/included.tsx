import Image from "next/image";
import { gLite2Data } from "@/lib/product/g-lite-2";

export default function Included() {
    const { included } = gLite2Data;

    return (
        <section className="py-24 bg-black text-slate-100 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-16">
                    <h2 className="text-4xl lg:text-5xl font-black uppercase mb-6 tracking-tight text-white">
                        {included.headerTitleHtml}
                    </h2>
                    <p className="text-zinc-400 max-w-2xl text-lg font-medium leading-relaxed">
                        {included.headerDescription}
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center gap-12 mt-20">
                    <div className="lg:w-1/2 space-y-4">
                        <h3 className="text-4xl lg:text-5xl font-black italic tracking-widest uppercase mb-8 text-white" style={{ fontFamily: 'impact, sans-serif' }}>
                            {included.itemTitleHtml}
                        </h3>
                        <p className="text-zinc-400 leading-relaxed text-lg max-w-md font-medium">
                            {included.itemDescription}
                        </p>
                    </div>

                    <div className="lg:w-1/2 flex justify-center">
                        <Image
                            src={included.image.src}
                            alt={included.image.alt}
                            width={350}
                            height={350}
                            className="object-contain drop-shadow-2xl rounded-2xl"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
