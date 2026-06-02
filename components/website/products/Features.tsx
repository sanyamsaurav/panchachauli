import { gLite2Data } from "@/lib/product/g-lite-2";

export default function Features() {
    return (
        <section className="py-16 bg-zinc-900 border-y border-zinc-800 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center uppercase tracking-wide">
                    {gLite2Data.features.map((feature, index) => (
                        <div key={index} className="space-y-2">
                            <h3 className="text-4xl font-black text-white">{feature.value}</h3>
                            <p className="text-blue-400 text-sm font-semibold">{feature.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
