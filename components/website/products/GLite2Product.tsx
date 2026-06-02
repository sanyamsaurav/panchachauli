import Image from "next/image";
import Link from "next/link";
import { MoveRight, CheckCircle2 } from "lucide-react";
import Flate from "./flate";
import Included from "./included";

export default function GLite2Product() {
    return (
        <div className="bg-slate-900 text-slate-100 min-h-screen font-sans selection:bg-blue-600 selection:text-white">

            {/* Hero Section */}
            <section id="hero" className="relative pt-20 pb-32 overflow-hidden bg-slate-900">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
                    <div className="lg:w-1/2 z-10 space-y-6">
                        <h1 className="text-6xl lg:text-8xl font-black uppercase tracking-tighter leading-none text-white">
                            Simplicity <br />
                            <span className="text-blue-500">And</span> <br />
                            Minimalism
                        </h1>
                        <p className="text-lg lg:text-xl text-slate-400 max-w-lg leading-relaxed pt-4">
                            Designed with a minimalist panel structure and fewer seams, the G-Lite 2 is straightforward to pack and less prone to packing errors. This reduction in complexity enhances deployment speed and reliability across a wide range of emergency scenarios.
                        </p>
                        <div className="pt-4 flex gap-4">
                            <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-full uppercase tracking-wider text-sm transition shadow-lg shadow-blue-600/30">
                                Discover More
                            </button>
                        </div>
                    </div>
                    <div className="lg:w-1/2 mt-12 lg:mt-0 relative h-[600px] w-full flex justify-center items-center">
                        <div className="absolute inset-0 bg-blue-500 opacity-10 blur-[100px] rounded-full"></div>
                        <Image
                            src="/rescues/square/g-lite-2/parachute.png"
                            alt="G-Lite 2 Parachute"
                            width={800}
                            height={800}
                            className="object-contain z-10 drop-shadow-2xl relative"
                            priority
                        />
                    </div>
                </div>
            </section>

            {/* Features Spotlight */}
            <section className="py-16 bg-slate-800 border-y border-slate-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center uppercase tracking-wide">
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-white">2.5s</h3>
                            <p className="text-blue-400 text-sm font-semibold">Deployment Time</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-white">5.1m/s</h3>
                            <p className="text-blue-400 text-sm font-semibold">Sink Rate</p>
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-4xl font-black text-white">1.34kg</h3>
                            <p className="text-blue-400 text-sm font-semibold">Ultra Light</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Description Section */}
            <section id="description" className="py-24 bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2">
                            <Image
                                src="/rescues/square/g-lite-2/bag.png"
                                alt="Rescue Bag"
                                width={600}
                                height={600}
                                className="rounded-2xl object-cover w-full shadow-2xl shadow-black/50"
                            />
                        </div>
                        <div className="lg:w-1/2 space-y-8">
                            <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-tight text-white">Redefined simplicity, <br /><span className="text-blue-500">enhanced performance</span></h2>
                            <div className="space-y-6 text-slate-400 text-lg">
                                <p>
                                    The iconic G-Lite has been reengineered. Now designed as a square, planar rescue, the G-Lite 2 features a 5-apex line configuration instead of a single centre line.
                                </p>
                                <p>
                                    This setup minimizes oscillations, increases pitch stability, and significantly reduces the sink rate without adding surface area or weight. The premium materials ensure incredible longevity.
                                </p>
                                <ul className="space-y-3 pt-4">
                                    <li className="flex items-center text-slate-200 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 shrink-0" /> 5-apex line configuration</li>
                                    <li className="flex items-center text-slate-200 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 shrink-0" /> Square planar design</li>
                                    <li className="flex items-center text-slate-200 font-medium"><CheckCircle2 className="w-5 h-5 text-blue-500 mr-3 shrink-0" /> Reduced oscillations</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Flate />

            {/* Reduced Weight Section */}
            <section className="py-24 bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 space-y-6">
                            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white">
                                Reduced <br />
                                Weight And <br />
                                Packing <br />
                                Volume
                            </h2>
                            <p className="text-lg lg:text-xl text-slate-200 max-w-lg leading-relaxed pt-4 font-medium">
                                Thanks to its planar layout and simplified construction, the G-Lite 2 is slightly lighter and more compact than its predecessor. It&apos;s easier to carry and fits more efficiently into modern harness compartments.
                            </p>
                        </div>
                        <div className="lg:w-1/2 flex justify-center">
                            <Image
                                src="/rescues/square/g-lite-2/reduced_weight_bags.png"
                                alt="Reduced Weight And Packing Volume"
                                width={800}
                                height={600}
                                className="object-contain w-full drop-shadow-2xl rounded-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Sizing and Weight Range Section */}
            <section className="py-24 bg-slate-900 border-b border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 space-y-6">
                            <h2 className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none text-white">
                                Well-<br />
                                Considered <br />
                                Sizing And <br />
                                Weight Range
                            </h2>
                            <p className="text-lg lg:text-xl text-slate-200 max-w-lg leading-relaxed pt-4 font-medium">
                                While the flat surface has been reduced compared to it&apos;s predecessor, we have maintained the same weight ranges with improved sink rate performance.
                            </p>
                            <p className="text-lg lg:text-xl text-slate-200 max-w-lg leading-relaxed font-medium">
                                This is due to the Planar Rescue Technology. The surface reduction also contributes significantly to the reduced packed volume.
                            </p>
                        </div>
                        <div className="lg:w-1/2 flex justify-center">
                            <Image
                                src="/rescues/square/g-lite-2/sizing_bags.png"
                                alt="Sizing and Weight Range"
                                width={800}
                                height={600}
                                className="object-contain w-full drop-shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>



            {/* Included Section */}
            <Included />

        </div>
    );
}
