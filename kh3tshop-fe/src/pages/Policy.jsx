import React from "react";
import {
  ShieldCheck,
  Truck,
  RefreshCcw,
  Clock3,
  ChevronRight,
  MessageCircle,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";

import ChatBot from "../components/ChatBot";
import Contact from "../components/Contact";

const Policy = () => {
  const policies = [
    {
      icon: <RefreshCcw className="w-6 h-6" />,
      title: "Đổi trả linh hoạt",
      desc: "Hỗ trợ đổi trả trong vòng 15 ngày với quy trình nhanh chóng và minh bạch.",
    },
    {
      icon: <Truck className="w-6 h-6" />,
      title: "Giao hàng toàn quốc",
      desc: "Miễn phí vận chuyển cho đơn hàng từ 1.000.000đ trên toàn quốc.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6" />,
      title: "Bảo mật dữ liệu",
      desc: "Thông tin khách hàng được mã hóa và bảo vệ theo tiêu chuẩn quốc tế.",
    },
  ];

  const faq = [
    {
      q: "KREDO có hỗ trợ đổi size không?",
      a: "Chúng tôi hỗ trợ đổi size trong vòng 15 ngày nếu sản phẩm còn nguyên tem mác.",
    },
    {
      q: "Bao lâu tôi nhận được hàng?",
      a: "Đơn hàng thường được giao trong 2-4 ngày làm việc tùy khu vực.",
    },
    {
      q: "Có hỗ trợ COD không?",
      a: "KREDO hỗ trợ thanh toán khi nhận hàng trên toàn quốc.",
    },
  ];

  return (
      <div className="bg-[#F6F2EA] text-black overflow-hidden">
        {/* HERO */}
        <section className="relative min-h-screen flex items-center">
          {/* Background */}
          <div className="absolute inset-0">
            <img
                src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=1974&auto=format&fit=crop"
                alt=""
                className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Blur */}
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl" />

          <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center">
            {/* LEFT */}
            <div>
              <div className="inline-flex items-center gap-3 bg-white/10 border border-white/20 backdrop-blur-xl px-5 py-2 rounded-full text-white uppercase tracking-[0.3em] text-xs mb-8">
                <Sparkles className="w-4 h-4" />
                KREDO Policies
              </div>

              <h1 className="text-white text-6xl lg:text-[8rem] leading-[0.85] font-black uppercase tracking-tighter">
                Service
                <br />
                <span className="text-orange-300">Policies</span>
              </h1>

              <p className="mt-8 text-white/70 text-lg leading-relaxed max-w-xl">
                Mọi chính sách tại KREDO được xây dựng để mang lại trải nghiệm mua
                sắm minh bạch, hiện đại và đáng tin cậy nhất cho khách hàng.
              </p>

              <div className="flex flex-wrap gap-5 mt-12">
                <button className="bg-white text-black px-8 py-4 rounded-full font-black uppercase tracking-widest text-xs hover:scale-105 transition-all">
                  Tìm hiểu thêm
                </button>

                <button className="border border-white/20 text-white px-8 py-4 rounded-full backdrop-blur-xl hover:bg-white/10 transition-all flex items-center gap-3">
                  Hỗ trợ khách hàng
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* RIGHT */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6 mt-16">
                <div className="bg-white p-8 rounded-[2rem] shadow-2xl">
                  <Clock3 className="w-12 h-12 text-orange-400 mb-6" />

                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-4">
                    15 Days
                  </h3>

                  <p className="text-black/60 leading-relaxed">
                    Chính sách đổi trả lên đến 15 ngày kể từ khi nhận hàng.
                  </p>
                </div>

                <div className="rounded-[2rem] overflow-hidden h-[300px]">
                  <img
                      src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=1973&auto=format&fit=crop"
                      alt=""
                      className="w-full h-full object-cover hover:scale-110 duration-700"
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[2rem] overflow-hidden h-[400px]">
                  <img
                      src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop"
                      alt=""
                      className="w-full h-full object-cover hover:scale-110 duration-700"
                  />
                </div>

                <div className="bg-black text-white p-8 rounded-[2rem]">
                  <ShieldCheck className="w-12 h-12 text-orange-300 mb-6" />

                  <h3 className="text-2xl font-black uppercase mb-4">
                    Secure System
                  </h3>

                  <p className="text-white/60 leading-relaxed">
                    Mọi giao dịch và thông tin khách hàng đều được bảo vệ an toàn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POLICY CARDS */}
        <section className="py-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-20">
              <div>
              <span className="uppercase tracking-[0.4em] text-orange-500 text-sm font-bold">
                Customer Experience
              </span>

                <h2 className="mt-5 text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none">
                  Built For
                  <br />
                  Trust.
                </h2>
              </div>

              <p className="hidden lg:block max-w-md text-black/50 leading-relaxed">
                Chúng tôi đặt trải nghiệm và quyền lợi khách hàng lên hàng đầu
                trong mọi chính sách dịch vụ.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {policies.map((item, index) => (
                  <div
                      key={index}
                      className="group bg-white rounded-[2.5rem] p-10 border border-black/5 hover:bg-black hover:text-white transition-all duration-500 shadow-xl"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center mb-8 group-hover:bg-white/10">
                      {item.icon}
                    </div>

                    <div className="text-5xl font-black text-black/10 group-hover:text-white/10 mb-8">
                      0{index + 1}
                    </div>

                    <h3 className="text-3xl font-black uppercase tracking-tighter mb-5">
                      {item.title}
                    </h3>

                    <p className="text-black/50 group-hover:text-white/60 leading-relaxed">
                      {item.desc}
                    </p>

                    <button className="mt-10 flex items-center gap-2 uppercase tracking-widest text-xs font-black">
                      Chi tiết
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-40">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-20">
            <span className="uppercase tracking-[0.4em] text-orange-500 text-sm font-bold">
              FAQ
            </span>

              <h2 className="mt-5 text-5xl lg:text-6xl font-black uppercase tracking-tighter">
                Frequently
                <br />
                Asked Questions
              </h2>
            </div>

            <div className="space-y-6">
              {faq.map((item, index) => (
                  <div
                      key={index}
                      className="bg-white rounded-[2rem] p-8 shadow-xl border border-black/5 hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-500 flex items-center justify-center shrink-0">
                        <MessageCircle className="w-5 h-5" />
                      </div>

                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight mb-4">
                          {item.q}
                        </h3>

                        <p className="text-black/60 leading-relaxed">
                          {item.a}
                        </p>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
          </div>
        </section>

        {/* CONTACT CTA */}
        <section className="pb-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="bg-black text-white rounded-[3rem] p-16 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-400/20 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div>
                <span className="uppercase tracking-[0.3em] text-orange-300 text-xs font-bold">
                  Support Center
                </span>

                  <h2 className="mt-5 text-4xl lg:text-6xl font-black uppercase tracking-tighter leading-none">
                    Need
                    <br />
                    Assistance?
                  </h2>
                </div>

                <div className="flex flex-wrap gap-5">
                  <a
                      href="tel:+84901234567"
                      className="bg-white text-black px-8 py-5 rounded-full uppercase tracking-widest text-xs font-black hover:scale-105 transition-all"
                  >
                    Hotline
                  </a>

                  <a
                      href="mailto:support@kredo.vn"
                      className="border border-white/20 px-8 py-5 rounded-full uppercase tracking-widest text-xs font-black hover:bg-white/10 transition-all"
                  >
                    Email Support
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <ChatBot />
        <Contact />
      </div>
  );
};

export default Policy;