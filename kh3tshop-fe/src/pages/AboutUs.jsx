import React from "react";
import {
    ArrowRight,
    Sparkles,
    Quote,
    Play,
    Layers3,
    CircleDashed,
} from "lucide-react";
import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";
import { Link } from "react-router-dom";
const About = () => {
    return (
        <div className="bg-[#F5F1EA] overflow-hidden">
            {/* HERO */}
            <section className="relative min-h-screen flex items-center">
                {/* Background */}
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2070&auto=format&fit=crop"
                        alt="Fashion"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                </div>

                {/* Glow */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-3xl" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left */}
                    <div>
                        <div className="inline-flex items-center gap-3 border border-white/20 bg-white/10 backdrop-blur-xl px-5 py-2 rounded-full text-white text-sm uppercase tracking-[0.3em] mb-8">
                            <Sparkles className="w-4 h-4" />
                            Fashion Studio 2025
                        </div>

                        <h1 className="text-white text-6xl lg:text-[8rem] leading-[0.85] font-black tracking-tighter uppercase">
                            Redefine
                            <br />
                            <span className="text-orange-300">Minimal</span>
                        </h1>

                        <p className="mt-8 text-white/70 text-lg max-w-xl leading-relaxed">
                            KREDO xây dựng thời trang như một trải nghiệm thị giác hiện đại —
                            tối giản nhưng vẫn mang dấu ấn cá nhân mạnh mẽ.
                        </p>

                        <div className="flex flex-wrap gap-5 mt-12">
                            <Link
                                to="/product"
                                className="bg-white text-black px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:scale-105 transition-all inline-block"
                            >
                                Khám phá ngay
                            </Link>

                            <button className="flex items-center gap-3 text-white border border-white/20 px-8 py-4 rounded-full backdrop-blur-xl hover:bg-white/10 transition-all">
                                <Play className="w-4 h-4 fill-white" />
                                Xem câu chuyện
                            </button>
                        </div>
                    </div>

                    {/* Right Cards */}
                    <div className="relative">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-6 mt-20">
                                <div className="rounded-[2rem] overflow-hidden h-[320px]">
                                    <img
                                        src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1974&auto=format&fit=crop"
                                        alt=""
                                        className="w-full h-full object-cover hover:scale-110 duration-700"
                                    />
                                </div>

                                <div className="bg-white p-8 rounded-[2rem]">
                                    <CircleDashed className="w-10 h-10 text-orange-400 mb-6" />

                                    <h3 className="text-2xl font-black mb-4 uppercase">
                                        Identity
                                    </h3>

                                    <p className="text-black/60 leading-relaxed">
                                        Chúng tôi theo đuổi phong cách thiết kế vượt thời gian thay
                                        vì xu hướng ngắn hạn.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="bg-black text-white p-8 rounded-[2rem]">
                                    <Layers3 className="w-10 h-10 text-orange-300 mb-6" />

                                    <h3 className="text-2xl font-black uppercase mb-4">
                                        Modern Aesthetic
                                    </h3>

                                    <p className="text-white/60 leading-relaxed">
                                        Kết hợp giữa thời trang đương đại và kiến trúc tối giản để
                                        tạo nên trải nghiệm độc bản.
                                    </p>
                                </div>

                                <div className="rounded-[2rem] overflow-hidden h-[420px]">
                                    <img
                                        src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                                        alt=""
                                        className="w-full h-full object-cover hover:scale-110 duration-700"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-white shadow-2xl rounded-full px-8 py-5 flex items-center gap-4">
                            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                            <span className="font-bold uppercase tracking-widest text-xs">
                Minimal • Premium • Contemporary
              </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ABOUT SECTION */}
            <section className="py-40">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        {/* Image */}
                        <div className="relative">
                            <div className="absolute -top-10 -left-10 w-40 h-40 border border-black/10 rounded-full" />

                            <div className="rounded-[3rem] overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1973&auto=format&fit=crop"
                                    alt=""
                                    className="w-full h-[700px] object-cover"
                                />
                            </div>

                            <div className="absolute bottom-10 -right-10 bg-black text-white p-8 rounded-[2rem] max-w-xs">
                <span className="text-orange-300 text-5xl font-black">
                  10+
                </span>
                                <p className="mt-3 text-white/60">
                                    Bộ sưu tập được phát triển với triết lý tối giản hiện đại.
                                </p>
                            </div>
                        </div>

                        {/* Content */}
                        <div>
              <span className="text-orange-500 uppercase tracking-[0.4em] text-sm font-bold">
                About Kredo
              </span>

                            <h2 className="mt-6 text-5xl lg:text-7xl font-black tracking-tighter leading-none uppercase">
                                Fashion
                                <br />
                                Meets
                                <br />
                                Emotion
                            </h2>

                            <p className="mt-10 text-black/60 text-lg leading-relaxed">
                                KREDO hướng tới việc biến quần áo thành một phần trong phong
                                cách sống. Không chỉ đẹp về hình thức mà còn phải tạo cảm giác
                                tự tin, thoải mái và có chiều sâu.
                            </p>

                            <div className="grid sm:grid-cols-2 gap-8 mt-14">
                                {[
                                    {
                                        title: "Tinh giản",
                                        desc: "Thiết kế gọn gàng nhưng giàu chiều sâu thị giác.",
                                    },
                                    {
                                        title: "Chất lượng",
                                        desc: "Ưu tiên chất liệu cao cấp và độ hoàn thiện cao.",
                                    },
                                    {
                                        title: "Đương đại",
                                        desc: "Lấy cảm hứng từ nghệ thuật và kiến trúc hiện đại.",
                                    },
                                    {
                                        title: "Cá tính",
                                        desc: "Tạo nên bản sắc riêng cho từng người mặc.",
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="border border-black/10 rounded-[2rem] p-8 hover:bg-black hover:text-white transition-all duration-500 group"
                                    >
                                        <div className="text-4xl font-black text-orange-400 mb-4">
                                            0{index + 1}
                                        </div>

                                        <h3 className="text-2xl font-black uppercase mb-3">
                                            {item.title}
                                        </h3>

                                        <p className="text-black/50 group-hover:text-white/60 transition-colors">
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <button className="mt-14 flex items-center gap-3 font-black uppercase tracking-widest text-sm group">
                                Discover More
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUOTE */}
            <section className="pb-40">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <Quote className="mx-auto w-20 h-20 text-orange-400 mb-10" />

                    <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-tight">
                        “Sự tối giản không làm bạn ít nổi bật hơn —
                        <span className="text-orange-500"> nó khiến bạn tinh tế hơn.</span>
                    </h2>

                    <div className="mt-10 text-black/40 uppercase tracking-[0.4em] text-sm">
                        KREDO Creative Direction
                    </div>
                </div>
            </section>

            <ChatBot />
            <Contact />
        </div>
    );
};

export default About;