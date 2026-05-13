import React from "react";
import { Quote, MoveRight } from "lucide-react";
import ChatBot from "../components/ChatBot"; 
import Contact from "../components/Contact";

const About = () => {
    return (
        <div className="min-h-screen bg-[#FDFCF8]">
            {/* Unique Vertical Hero Section */}
            <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-32">
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2070&auto=format&fit=crop"
                        alt="Fashion Background"
                        className="w-full h-full object-cover opacity-20 grayscale"
                    />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 text-center">
                    <span className="text-accent font-black text-xs tracking-[0.6em] uppercase mb-12 block animate-fade-in">Established 2025</span>
                    <h1 className="text-8xl lg:text-[14rem] font-black text-primary mb-12 tracking-tighter leading-[0.8] uppercase select-none">
                        KREDO <br />
                        <span className="text-accent">STUDIO</span>
                    </h1>
                    <div className="max-w-2xl mx-auto border-t-2 border-primary/10 pt-12">
                         <p className="text-primary text-2xl lg:text-3xl font-medium leading-tight tracking-tight mb-12">
                            Chúng tôi định hình phong cách sống tối giản thông qua ngôn ngữ thiết kế đương đại.
                        </p>
                        <div className="flex items-center justify-center gap-4 text-primary font-black uppercase text-xs tracking-widest cursor-pointer hover:text-accent transition-colors group">
                            Cuộn để khám phá <MoveRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                        </div>
                    </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute bottom-20 left-10 hidden xl:block animate-bounce-slow">
                    <span className="text-primary/10 text-9xl font-black uppercase tracking-tighter rotate-90 origin-left">Minimalism</span>
                </div>
            </div>

            {/* The Vision - Grid Layout */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-40">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-end">
                    <div className="lg:col-span-7">
                        <h2 className="text-6xl font-black text-primary mb-12 tracking-tighter uppercase leading-none">
                            Tầm nhìn của <br /> <span className="text-accent">chúng tôi</span>
                        </h2>
                        <p className="text-primary/60 text-xl font-medium leading-relaxed max-w-2xl mb-12">
                            KREDO không chỉ là một thương hiệu thời trang, đó là một tuyên ngôn về sự tinh giản. 
                            Chúng tôi tin rằng trong một thế giới ồn ào, sự im lặng của sự tối giản là tiếng nói mạnh mẽ nhất.
                        </p>
                        <div className="grid grid-cols-2 gap-12">
                             <div>
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">Chất liệu</h3>
                                <p className="text-primary/40 text-sm font-medium">Lựa chọn những sợi vải tự nhiên, bền bỉ và mang lại cảm giác thoải mái tuyệt đối.</p>
                             </div>
                             <div>
                                <h3 className="text-sm font-black text-primary uppercase tracking-widest mb-4">Phom dáng</h3>
                                <p className="text-primary/40 text-sm font-medium">Tỉ lệ hình khối được tính toán chính xác để tôn vinh vóc dáng người mặc.</p>
                             </div>
                        </div>
                    </div>
                    <div className="lg:col-span-5">
                        <div className="relative aspect-[3/4] rounded-[4rem] overflow-hidden shadow-2xl">
                             <img 
                                src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
                                alt="Minimalism Design"
                                className="w-full h-full object-cover"
                             />
                        </div>
                    </div>
                </div>
            </div>

            {/* Philosophy Cards - New Design */}
            <div className="bg-primary py-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6">
                    <div className="flex flex-col lg:flex-row gap-12">
                        {[
                            { title: "Tối giản", desc: "Sức mạnh nằm ở sự tinh gọn. Chúng tôi loại bỏ những chi tiết rườm rà." },
                            { title: "Chất lượng", desc: "Không thỏa hiệp với sự tầm thường. Mỗi đường kim mũi chỉ là một lời hứa." },
                            { title: "Cộng đồng", desc: "Kết nối những tâm hồn đồng điệu qua phong cách sống tinh tế." }
                        ].map((item, idx) => (
                            <div key={idx} className="flex-1 bg-white/5 border border-white/10 p-12 rounded-[3rem] hover:bg-white/10 transition-all duration-500 group">
                                <span className="text-accent text-4xl font-black mb-8 block group-hover:scale-110 transition-transform">0{idx + 1}</span>
                                <h3 className="text-white text-3xl font-black uppercase tracking-tighter mb-6">{item.title}</h3>
                                <p className="text-white/40 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Large Quote */}
            <div className="py-40 text-center max-w-5xl mx-auto px-4">
                <Quote className="text-accent w-16 h-16 mx-auto mb-12 opacity-50" />
                <h2 className="text-4xl lg:text-6xl font-black text-primary tracking-tighter leading-tight italic uppercase">
                    "Thời trang là cách bạn nói với thế giới bạn là ai mà không cần phải mở lời."
                </h2>
                <div className="mt-12 flex items-center justify-center gap-4">
                    <div className="w-12 h-px bg-primary/20"></div>
                    <span className="text-primary font-black uppercase text-xs tracking-widest">KREDO Creative Team</span>
                    <div className="w-12 h-px bg-primary/20"></div>
                </div>
            </div>

            <ChatBot />
            <Contact />
        </div>
    );
};

export default About;
