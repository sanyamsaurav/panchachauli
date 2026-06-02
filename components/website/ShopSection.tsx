import Link from "next/link";
import { ShoppingBag, ArrowRight, MessageCircle } from "lucide-react";
import { useWhatsApp } from "@/hooks/useWhatsApp";

export default function ShopSection() {
    const { whatsappLink } = useWhatsApp("Hi! I'm interested in buying paragliding equipment. Can you help me?");

    return (
        <section className="relative py-24 overflow-hidden">
            {/* Background with Gradient and Overlay */}
            <div className="absolute inset-0 bg-black">
                <div
                    className="absolute inset-0 opacity-50 bg-cover bg-center"
                    style={{
                        backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2069&auto=format&fit=crop')`,
                    }}
                ></div>
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="lg:w-1/2">
                    <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter text-white leading-none mb-6">
                        Gear Up For <br />
                        <span className="text-blue-500">Your Next Adventure</span>
                    </h2>
                    <p className="text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
                        Discover our curated selection of professional paragliding equipment, from the latest G-Lite rescues to premium harnesses and accessories.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <Link
                            href="/shop"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded-full uppercase tracking-wider text-sm transition-all flex items-center group"
                        >
                            Explore Shop
                            <ShoppingBag className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                        </Link>
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-10 rounded-full uppercase tracking-wider text-sm transition-all flex items-center group"
                        >
                            Buy Now
                            <MessageCircle className="ml-3 w-5 h-5 group-hover:scale-110 transition-transform" />
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
