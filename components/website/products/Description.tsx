import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { gLite2Data } from "@/lib/product/g-lite-2";

export default function Description() {
    const { description } = gLite2Data;

    return (
        <section id="description" className="py-24 bg-black border-b border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <Image
                            src={description.image.src}
                            alt={description.image.alt}
                            width={description.image.width}
                            height={description.image.height}
                            className="rounded-2xl object-cover w-full shadow-2xl shadow-black/50"
                        />
                    </div>
                    <div className="lg:w-1/2 space-y-8">
                        <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">{description.titleLine1} <br /><span className="text-blue-500">{description.titleLine2}</span></h2>
                        <div className="space-y-6 text-slate-400 text-lg">
                            {description.paragraphs.map((paragraph, index) => (
                                <p key={index}>{paragraph}</p>
                            ))}
                            <ul className="space-y-3 pt-4">
                                {description.list.map((item, index) => (
                                    <li key={index} className="flex items-center text-slate-200 font-medium">
                                        <CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
