"use client";

import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { gLite2Data } from "@/lib/product/g-lite-2";
import { useWhatsApp } from "@/hooks/useWhatsApp";

export default function Hero() {
    const { hero } = gLite2Data;
    const { whatsappLink } = useWhatsApp(`Hi! I'm interested in buying the ${hero.titleLine1} ${hero.titleLine2}. Can you help me?`);

    return (
        <section id="hero" className="relative pt-20 pb-32 overflow-hidden bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
                <div className="lg:w-1/2 z-10 space-y-6">
                    <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-white">
                        {hero.titleLine1} <br />
                        <span className="text-blue-500">{hero.titleLine2}</span> <br />
                        {hero.titleLine3}
                    </h1>
                    <p className="text-lg lg:text-xl text-slate-400 max-w-lg leading-relaxed pt-4">
                        {hero.description}
                    </p>
                    <div className="pt-4 flex gap-4">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full uppercase tracking-wider text-sm transition shadow-lg shadow-green-600/30 flex items-center group"
                        >
                            Buy Now
                            <MessageCircle className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>
                <div className="lg:w-1/2 mt-12 lg:mt-0 relative h-[600px] w-full flex justify-center items-center">
                    <div className="absolute inset-0 bg-blue-500 opacity-10 blur-[100px] rounded-full"></div>
                    <Image
                        src={hero.image.src}
                        alt={hero.image.alt}
                        width={hero.image.width}
                        height={hero.image.height}
                        className="object-contain z-10 drop-shadow-2xl relative rounded-2xl border border-zinc-800"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}
