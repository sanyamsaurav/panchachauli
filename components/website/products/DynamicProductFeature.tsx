'use client';

import Image from "next/image";
import { MessageCircle, CheckCircle2 } from "lucide-react";
import type { IProduct } from "@/types/models";
import { useWhatsApp } from "@/hooks/useWhatsApp";

interface Props {
    product: IProduct;
}

export default function DynamicProductFeature({ product }: Props) {
    const { whatsappLink } = useWhatsApp(`Hi! I'm interested in buying the ${product.title}. Can you help me?`);

    return (
        <div className="bg-black text-slate-100 min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            {/* HERO SECTION */}
            {product.hero && (
                <section className="relative pt-20 pb-32 overflow-hidden bg-black border-b border-zinc-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
                        <div className="lg:w-1/2 z-10 space-y-6">
                            <h1 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white">
                                <span className="block mb-2">{product.hero.title}</span>
                                {product.hero.subtitle && (
                                    <span className="text-blue-500 block text-4xl lg:text-6xl mt-2">{product.hero.subtitle}</span>
                                )}
                            </h1>
                            {product.description && (
                                <p className="text-lg lg:text-xl text-slate-400 max-w-lg leading-relaxed pt-4">
                                    {product.description}
                                </p>
                            )}
                            <div className="pt-8 flex gap-4">
                                <a
                                    href={whatsappLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full uppercase tracking-wider text-sm transition shadow-lg shadow-green-600/30 flex items-center group"
                                >
                                    Buy Now - {product.price}
                                    <MessageCircle className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                                </a>
                            </div>
                        </div>
                        {product.hero.image && (
                            <div className="lg:w-1/2 mt-16 lg:mt-0 relative h-[500px] w-full flex justify-center items-center">
                                <div className="absolute inset-0 bg-blue-500 opacity-20 blur-[120px] rounded-full"></div>
                                <img
                                    src={product.hero.image}
                                    alt={product.hero.title}
                                    className="object-contain w-full h-full z-10 drop-shadow-2xl relative rounded-2xl"
                                />
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* FEATURES SECTION */}
            {product.features && product.features.length > 0 && (
                <section className="py-24 bg-zinc-950 border-b border-zinc-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">Key Features</h2>
                            <div className="w-24 h-1 bg-blue-600 mx-auto mt-6"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {product.features.map((feature, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800/50 hover:bg-zinc-900 transition-colors">
                                    <CheckCircle2 className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                                    <p className="text-slate-300 font-medium leading-relaxed">{feature}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* SECTION 2 */}
            {product.section2 && product.section2.title && (
                <section className="py-24 bg-black overflow-hidden relative">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            {product.section2.image && (
                                <div className="lg:w-1/2 relative">
                                    <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full"></div>
                                    <img
                                        src={product.section2.image}
                                        alt={product.section2.title}
                                        className="w-full h-auto rounded-3xl relative z-10 border border-zinc-800 shadow-2xl"
                                    />
                                </div>
                            )}
                            <div className="lg:w-1/2 space-y-8">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                                    {product.section2.title}
                                </h2>
                                <div className="w-16 h-1 bg-blue-600"></div>
                                <p className="text-lg text-slate-400 leading-relaxed whitespace-pre-line">
                                    {product.section2.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* SECTION 3 */}
            {product.section3 && product.section3.title && (
                <section className="py-24 bg-zinc-950 overflow-hidden relative border-t border-zinc-900">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row-reverse items-center gap-16">
                            {product.section3.image && (
                                <div className="lg:w-1/2 relative">
                                    <div className="absolute inset-0 bg-purple-600/10 blur-[100px] rounded-full"></div>
                                    <img
                                        src={product.section3.image}
                                        alt={product.section3.title}
                                        className="w-full h-auto rounded-3xl relative z-10 border border-zinc-800 shadow-2xl"
                                    />
                                </div>
                            )}
                            <div className="lg:w-1/2 space-y-8">
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
                                    {product.section3.title}
                                </h2>
                                <div className="w-16 h-1 bg-blue-600"></div>
                                <p className="text-lg text-slate-400 leading-relaxed whitespace-pre-line">
                                    {product.section3.description}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
