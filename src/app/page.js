import Banner from "@/components/Banner";
import TrendingIdeas from "@/components/TrendingIdeas";
import TwoMore from "@/components/TwoMore";
import Image from "next/image";

export default function Home() {
    return (
        <div>
            <Banner />
            <TrendingIdeas />
            <TwoMore />
        </div>
    );
}
