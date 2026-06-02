import Hero from "./Hero";
import Features from "./Features";
import Description from "./Description";
import Flate from "./flate";
import ReducedWeight from "./ReducedWeight";
import Sizing from "./Sizing";

import Included from "./included";
import ShopSection from "../ShopSection";

export default function GLite2ProductFeature() {
    return (
        <div className="bg-black text-slate-100 min-h-screen font-sans selection:bg-blue-600 selection:text-white">
            <Hero />
            <Features />
            <Description />
            <Flate />
            <ReducedWeight />
            <Sizing />
            <Included />
            {/* <ShopSection /> */}
        </div>
    );
}
