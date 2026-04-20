import React from "react";
import { Quote, MapPin } from "lucide-react";
import ChatBot from "../components/ChatBot"; 
import Contact from "../components/Contact";
const About = () => {
    const mainImage =
        "https://i.postimg.cc/jS1bQCB2/d254ab10-018d-4f01-9c3f-907c86bb7f24.jpg";
    const image2 =
        "https://i.postimg.cc/DwNTdmRW/7f3fc16b-adf3-453f-87e1-c9e76dbf90af.jpg";
    const image3 =
        "https://i.postimg.cc/DwNTdmR8/89f5c89b-1812-403b-8ab0-ba362c74008d.jpg";
    const image4 =
        "https://i.postimg.cc/y8GHXW2W/8f6024dc-a953-45da-975c-e332ad907d3f.jpg";
    const headerImage =
        "https://i.postimg.cc/GmfCJ962/1d12f798-bc0b-4c4a-83b4-8eb0a4981995.jpg";

    const quotes = [
        {
            id: 1,
            shortText:
                "We focus on high-quality products aligned with modern trends.",
            fullText:
                "We focus on high quality products that are in line with modern trends for potential and intelligent customers.",
        },
        {
            id: 2,
            shortText:
                "KH3T delivers the most trendy, luxurious, and fashionable styles.",
            fullText: "We bring the most trendy, luxurious and fashionable.",
        },
        {
            id: 3,
            shortText:
                "Fashion is intrinsically linked to life, serving as a personal highlight.",
            fullText:
                "Fashion is closely linked to life and life must have fashion as a highlight.",
        },
        {
            id: 4,
            shortText:
                "Our mission is to help you 'live your truth' through unique style.",
            fullText:
                "Our mission is to empower you to 'live your truth' and define your own unique style through our creative and bold designs.",
        },
    ];

    return (
        <div className="min-h-screen bg-background font-sans">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Hero Image at Top */}
                <div className="mb-20 rounded-2xl overflow-hidden shadow-2xl">
                    <img
                        src={headerImage}
                        alt="KH3T Brand Hero"
                        className="w-full h-[300px] object-cover mx-auto"
                    />
                </div>

                {/* KH3T Header */}
                <header className="text-center mb-20">
                    <h1 className="text-6xl sm:text-7xl font-extrabold text-foreground tracking-tighter">
                        KH3T
                    </h1>
                    <p className="text-xl text-muted-foreground mt-4 max-w-4xl mx-auto leading-relaxed">
                        KH3TKH3T Studio – a youthful, free-spirited, and bold local brand
                        inspiring you to express your individuality through creative
                        designs. Choose KH3T to “live your truth” and define your own style!
                    </p>
                </header>

                {/* Section 1: Vision and Quotes */}
                <section className="mb-40 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Column 1: Image and Origin */}
                    <div className="relative rounded-xl overflow-hidden shadow-2xl group transition-all duration-500 hover:scale-[1.01]">
                        <img
                            src={mainImage}
                            alt="Fashion inspiration"
                            className="w-full h-[500px] object-cover"
                        />

                        <span className="absolute top-6 left-6 text-2xl font-bold text-white tracking-widest bg-black/60 px-3 py-1 rounded-lg">
              Est 2025
            </span>

                        <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl">
                            <p className="text-gray-900 font-semibold text-base sm:text-lg">
                                <MapPin className="inline w-5 h-5 mr-1 text-red-500" /> From
                                Viet Nam
                            </p>
                            <p className="text-gray-700 text-sm mt-1">
                                We are inspired by many things and we will turn it into the best
                                products.
                            </p>
                        </div>
                    </div>

                    {/* Column 2: Mission and Quotes (Black/White Hover) */}
                    <div className="flex flex-col space-y-4 pt-8 lg:pt-0">
                        {quotes.map((quote) => (
                            <div
                                key={quote.id}
                                className="group relative p-6 bg-muted rounded-xl shadow-md border-t-4 border-foreground
             transition-all duration-300 cursor-pointer overflow-hidden
             hover:bg-black hover:shadow-2xl"
                            >
                                {/* Short Text (Trắng, Bold, không Nghiêng khi hover) */}
                                <p
                                    className="text-lg font-medium text-foreground italic
              group-hover:text-white group-hover:font-bold group-hover:not-italic transition-all duration-100"
                                >
                                    <Quote
                                        className="inline w-5 h-5 mr-2 text-red-500 transition-all duration-300
                                 group-hover:text-white group-hover:scale-110"
                                    />
                                    {quote.shortText}
                                </p>

                                {/* Full Text (Hiển thị khi Hover) */}
                                <div
                                    className="mt-2 pt-2 border-t border-muted-foreground/30
                opacity-0 max-h-0 transition-all duration-300 ease-in-out
                group-hover:opacity-100 group-hover:max-h-40 group-hover:border-white"
                                >
                                    <p
                                        className="text-sm text-muted-foreground
                group-hover:text-white/80 group-hover:font-normal"
                                    >
                                        "{quote.fullText}"
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mb-40">
                    <h2 className="text-3xl font-bold text-center text-foreground mb-8">
                        OUR STORY
                    </h2>

                    <div className="relative max-w-4xl mx-auto">
                        {/* Timeline Line: Thin, Subtle, and Gradient (GIỮ NGUYÊN) */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-foreground/50 via-foreground to-foreground/50 hidden lg:block"></div>

                        {/* Timeline Items (space-y-24 đã đảm bảo khoảng cách cân bằng) */}
                        <div className="space-y-20">
                            {/* MỐC 1: 2020-2024: Foundation */}
                            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center group">
                                {/* Content Card */}
                                <div className="lg:text-right lg:pr-12 col-span-1">
                                    <div
                                        className="p-6 bg-muted rounded-xl shadow-lg border-l-4 lg:border-l-0 lg:border-r-4 border-foreground/70
                 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-muted/90
                  group-hover:bg-black group-hover:border-red-500"
                                    >
                                        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-white">
                                            2020 - 2024
                                        </h3>
                                        <p className="text-sm font-semibold text-muted-foreground mb-2 group-hover:text-red-300">
                                            The Foundation
                                        </p>
                                        <p className="text-base text-muted-foreground leading-relaxed group-hover:text-white/80">
                                            Founded and developed by 5 passionate members who shared a
                                            vision of bringing quality fashion to Vietnamese youth.
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden lg:block"></div>{" "}
                                {/* Spacer for desktop */}
                                {/* Center Dot - ĐỒNG BỘ KÍCH THƯỚC (w-6 h-6) và thêm hiệu ứng ping */}
                                <div
                                    className="absolute left-0 lg:left-1/2 transform lg:-translate-x-1/2 w-6 h-6 bg-foreground rounded-full border-4 border-background shadow-xl transition-all duration-500
                  group-hover:bg-red-500 group-hover:scale-150 group-hover:shadow-red-500/50"
                                >
                                    <div className="absolute inset-0 rounded-full bg-foreground animate-ping opacity-75 group-hover:bg-red-500"></div>{" "}
                                    {/* Thêm hiệu ứng ping */}
                                </div>
                            </div>

                            {/* MỐC 2: Early Days: Basic & Classic */}
                            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center group">
                                <div className="hidden lg:block"></div>{" "}
                                {/* Spacer for desktop */}
                                {/* Content Card */}
                                <div className="lg:pl-12 col-span-1">
                                    <div
                                        className="p-6 bg-muted rounded-xl shadow-lg border-l-4 lg:border-l-4 lg:border-r-0 border-foreground/50
                 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-muted/90
                  group-hover:bg-black group-hover:border-red-500"
                                    >
                                        <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-white">
                                            Early Vision
                                        </h3>
                                        <p className="text-sm font-semibold text-muted-foreground mb-2 group-hover:text-red-300">
                                            Basic & Classic
                                        </p>
                                        <p className="text-base text-muted-foreground leading-relaxed group-hover:text-white/80">
                                            Our initial direction focused on timeless basic and
                                            classic pieces, creating wardrobe essentials for everyday
                                            style.
                                        </p>
                                    </div>
                                </div>
                                {/* Center Dot - ĐỒNG BỘ KÍCH THƯỚC (w-6 h-6) và thêm hiệu ứng ping */}
                                <div
                                    className="absolute left-0 lg:left-1/2 transform lg:-translate-x-1/2 w-6 h-6 bg-muted-foreground rounded-full border-4 border-background shadow-xl transition-all duration-500
                  group-hover:bg-red-500 group-hover:scale-150 group-hover:shadow-red-500/50"
                                >
                                    <div className="absolute inset-0 rounded-full bg-muted-foreground animate-ping opacity-75 group-hover:bg-red-500"></div>{" "}
                                    {/* Thêm hiệu ứng ping */}
                                </div>
                            </div>

                            {/* MỐC 3: The Shift: Trend Evolution */}
                            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center group">
                                {/* Content Card */}
                                <div className="lg:text-right lg:pr-12 col-span-1">
                                    <div
                                        className="p-6 bg-accent rounded-xl shadow-lg border-l-4 lg:border-l-0 lg:border-r-4 border-accent-foreground
                 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-accent/90
                  group-hover:bg-black group-hover:border-red-500"
                                    >
                                        <h3 className="text-2xl font-bold text-accent-foreground mb-2 group-hover:text-white">
                                            The Shift
                                        </h3>
                                        <p className="text-sm font-semibold text-accent-foreground/80 mb-2 group-hover:text-red-300">
                                            Evolution & Adaptation
                                        </p>
                                        <p className="text-base text-accent-foreground/90 leading-relaxed group-hover:text-white/80">
                                            Everything changed when fashion trends evolved rapidly. We
                                            adapted, transformed, and found our unique voice in the
                                            dynamic streetwear scene.
                                        </p>
                                    </div>
                                </div>
                                <div className="hidden lg:block"></div>{" "}
                                {/* Spacer for desktop */}
                                {/* Center Dot - ĐỒNG BỘ KÍCH THƯỚC (w-6 h-6) và thêm hiệu ứng ping */}
                                <div
                                    className="absolute left-0 lg:left-1/2 transform lg:-translate-x-1/2 w-6 h-6 bg-accent rounded-full border-4 border-background shadow-xl animate-pulse transition-all duration-500
                  group-hover:bg-red-500 group-hover:scale-150 group-hover:shadow-red-500/50"
                                >
                                    <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75 group-hover:bg-red-500"></div>{" "}
                                    {/* Thêm hiệu ứng ping */}
                                </div>
                            </div>

                            {/* MỐC 4: 2025: Official Launch */}
                            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center group">
                                <div className="hidden lg:block"></div>{" "}
                                {/* Spacer for desktop */}
                                {/* Content Card */}
                                <div className="lg:pl-12 col-span-1">
                                    <div
                                        className="p-6 bg-foreground rounded-xl shadow-lg border-l-4 lg:border-l-4 lg:border-r-0 border-background/50
                 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] hover:bg-foreground/90
                  group-hover:bg-black group-hover:border-red-500"
                                    >
                                        <h3 className="text-2xl font-bold text-background mb-2 group-hover:text-white">
                                            2025
                                        </h3>
                                        <p className="text-sm font-semibold text-background/80 mb-2 group-hover:text-red-300">
                                            Official Launch
                                        </p>
                                        <p className="text-base text-background/90 leading-relaxed group-hover:text-white/80">
                                            KH3T Studio officially launched, bringing bold, trendy,
                                            and distinctive designs to the youth. A new era of
                                            self-expression through fashion begins.
                                        </p>
                                    </div>
                                </div>
                                {/* Center Dot - ĐỒNG BỘ KÍCH THƯỚC (w-6 h-6) */}{" "}
                                <div
                                    className="absolute left-0 lg:left-1/2 transform lg:-translate-x-1/2 w-6 h-6 bg-accent rounded-full border-4 border-background shadow-xl animate-pulse transition-all duration-500
                  group-hover:bg-red-500 group-hover:scale-150 group-hover:shadow-red-500/50"
                                >
                                    <div className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75 group-hover:bg-red-500"></div>{" "}
                                    {/* Thêm hiệu ứng ping */}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 2: Product Showcase (Giữ nguyên) */}
                <section className="mb-40">
                    <h2 className="text-3xl font-bold text-center text-foreground mb-8">
                        OUR STORE VIEW
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="relative h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                            <img
                                src={image2}
                                alt="Fashion product shot 1"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                                <span className="text-white text-xl font-bold">LUXURY</span>
                            </div>
                        </div>

                        <div className="relative h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                            <img
                                src={image3}
                                alt="Fashion product shot 2"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                                <span className="text-white text-xl font-bold">TRENDY</span>
                            </div>
                        </div>

                        <div className="relative h-96 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300">
                            <img
                                src={image4}
                                alt="Fashion product shot 3"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition duration-300">
                <span className="text-white text-xl font-bold">
                  FASHIONABLE
                </span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Section 3: Slogan (Giữ nguyên) */}
                {/* <section className="relative shadow-2xl mb-20">
                    <h2 className="text-3xl font-bold text-center text-foreground mb-8">
                        OUR SLOGAN FROM KH3T
                    </h2>
                    <img
                        src="https://i.postimg.cc/NffrjWDk/Frame-137.png"
                        alt="KH3T Slogan"
                        className="self-stretch h-[500px] object-cover rounded-xl"
                    />
                </section> */}
            </div>
            <ChatBot/>
            <Contact/>
        </div>
    );
};

export default About;
