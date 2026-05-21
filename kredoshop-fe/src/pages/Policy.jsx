import React, { useState } from "react";
import { 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  Clock, 
  AlertCircle, 
  ChevronRight,
  MessageSquare,
  HelpCircle,
  FileText
} from "lucide-react";
import ChatBot from "../components/ChatBot"; 
import Contact from "../components/Contact";

const Policy = () => {
  const [activeTab, setActiveTab] = useState("return");

  const returnConditions = [
    "Sản phẩm phải còn nguyên tem mác, bao bì gốc và chưa qua sử dụng.",
    "Không có dấu hiệu giặt ủi, mùi lạ (nước hoa, cơ thể) hoặc hư hỏng do tác động bên ngoài.",
    "Áp dụng cho tất cả sản phẩm nguyên giá (không áp dụng hàng giảm giá sâu hoặc xả kho)."
  ];

  const returnSteps = [
    {
      title: "Kiểm tra điều kiện",
      desc: "Đảm bảo sản phẩm của bạn đáp ứng các tiêu chuẩn đổi trả của KREDO."
    },
    {
      title: "Liên hệ hỗ trợ",
      desc: "Gửi yêu cầu qua Zalo hoặc Hotline kèm mã đơn hàng và lý do cụ thể."
    },
    {
      title: "Đóng gói & Gửi hàng",
      desc: "Bọc kỹ sản phẩm trong hộp/túi gốc và gửi về địa chỉ kho của chúng tôi."
    },
    {
      title: "Xác nhận & Hoàn tất",
      desc: "KREDO sẽ kiểm tra sản phẩm và tiến hành đổi size hoặc hoàn tiền trong 3-5 ngày."
    }
  ];

  return (
    <div className="min-h-screen bg-white text-primary selection:bg-accent selection:text-white">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 border-b border-secondary">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 bg-secondary text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            KREDO Studio / Guidelines
          </span>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter uppercase mb-12 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
            Chính sách <br/> <span className="text-accent">Dịch vụ.</span>
          </h1>
          <p className="text-lg sm:text-xl text-primary/60 max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            Chúng tôi tin rằng sự minh bạch là nền tảng của niềm tin. Tại KREDO, mọi quy trình đều được thiết kế để bảo vệ quyền lợi tối đa cho khách hàng.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Sidebar Navigation */}
            <div className="lg:col-span-4 space-y-2 sticky top-32 h-fit">
              {[
                { id: "return", label: "Đổi trả & Hoàn tiền", icon: <RefreshCw size={18} /> },
                { id: "shipping", label: "Vận chuyển & Giao hàng", icon: <Truck size={18} /> },
                { id: "security", label: "Bảo mật thông tin", icon: <ShieldCheck size={18} /> },
                { id: "faq", label: "Câu hỏi thường gặp", icon: <HelpCircle size={18} /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-6 py-5 rounded-2xl transition-all duration-300 group ${
                    activeTab === tab.id 
                    ? "bg-primary text-white shadow-2xl shadow-primary/20 scale-105" 
                    : "bg-secondary/50 text-primary/60 hover:bg-secondary hover:text-primary"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {tab.icon}
                    <span className="text-sm font-black uppercase tracking-widest">{tab.label}</span>
                  </div>
                  <ChevronRight size={16} className={`transition-transform duration-300 ${activeTab === tab.id ? "translate-x-1" : "group-hover:translate-x-1"}`} />
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="lg:col-span-8 animate-in fade-in duration-700">
              {activeTab === "return" && (
                <div className="space-y-16">
                  <div>
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Quy định đổi trả</h2>
                    <div className="grid gap-4">
                      {returnConditions.map((item, idx) => (
                        <div key={idx} className="flex gap-4 p-6 bg-secondary/30 rounded-3xl border border-primary/5 hover:border-accent/20 transition-colors">
                          <AlertCircle size={20} className="text-accent shrink-0" />
                          <p className="text-sm font-medium leading-relaxed">{item}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 flex items-center gap-3">
                      <Clock className="text-accent" />
                      Thời hạn 15 ngày
                    </h3>
                    <div className="p-8 bg-primary text-white rounded-[2rem] shadow-2xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-accent/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                      <p className="text-lg font-medium leading-relaxed relative z-10">
                        KREDO chấp nhận đổi trả sản phẩm trong vòng <span className="text-accent font-black text-2xl">15 ngày</span> kể từ khi khách hàng nhận được hàng. Đây là cam kết cao nhất để bạn hoàn toàn yên tâm khi trải nghiệm các thiết kế của chúng tôi.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-2xl font-black uppercase tracking-tighter mb-8">Các bước thực hiện</h3>
                    <div className="grid gap-8">
                      {returnSteps.map((step, idx) => (
                        <div key={idx} className="relative pl-12 group">
                          <div className="absolute left-0 top-0 w-8 h-8 rounded-full border-2 border-primary/10 flex items-center justify-center text-[10px] font-black group-hover:border-accent group-hover:text-accent transition-colors duration-300">
                            0{idx + 1}
                          </div>
                          <h4 className="text-sm font-black uppercase tracking-widest mb-2">{step.title}</h4>
                          <p className="text-sm text-primary/60 leading-relaxed">{step.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "shipping" && (
                <div className="space-y-12">
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Vận chuyển</h2>
                  <div className="p-10 border-2 border-dashed border-primary/10 rounded-[3rem]">
                    <div className="flex flex-col items-center text-center space-y-6">
                      <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center">
                        <Truck size={32} className="text-accent" />
                      </div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter">Miễn phí vận chuyển</h3>
                      <p className="text-primary/60 leading-relaxed">
                        KREDO miễn phí vận chuyển cho tất cả đơn hàng trên toàn quốc có giá trị từ <span className="text-primary font-black">1.000.000đ</span>. Thời gian giao hàng trung bình từ 2-4 ngày làm việc.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "security" && (
                <div className="space-y-8">
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-8 text-accent">An toàn dữ liệu</h2>
                  <p className="text-lg text-primary/70 leading-relaxed">
                    Mọi thông tin cá nhân và lịch sử giao dịch của bạn tại KREDO đều được mã hóa và bảo mật tuyệt đối theo tiêu chuẩn SSL quốc tế. Chúng tôi cam kết không bao giờ chia sẻ dữ liệu của bạn cho bên thứ ba.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-secondary/50 rounded-2xl">
                      <ShieldCheck size={24} className="mb-4 text-accent" />
                      <h4 className="text-xs font-black uppercase tracking-widest mb-2">Mã hóa SSL</h4>
                      <p className="text-[10px] text-primary/40">Giao dịch an toàn 100%</p>
                    </div>
                    <div className="p-6 bg-secondary/50 rounded-2xl">
                      <FileText size={24} className="mb-4 text-accent" />
                      <h4 className="text-xs font-black uppercase tracking-widest mb-2">Quyền riêng tư</h4>
                      <p className="text-[10px] text-primary/40">Kiểm soát dữ liệu cá nhân</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "faq" && (
                <div className="space-y-6">
                  <h2 className="text-4xl font-black uppercase tracking-tighter mb-8">Hỏi đáp</h2>
                  {[
                    { q: "Tôi có thể đổi sản phẩm lấy tiền mặt không?", a: "KREDO hỗ trợ hoàn tiền qua chuyển khoản ngân hàng nếu sản phẩm lỗi hoặc không đúng mẫu mã đã đặt." },
                    { q: "Làm sao để theo dõi đơn hàng?", a: "Bạn có thể vào mục 'Đơn hàng của tôi' trong tài khoản cá nhân để xem trạng thái vận chuyển thời gian thực." },
                    { q: "KREDO có ship COD không?", a: "Chúng tôi hỗ trợ thanh toán khi nhận hàng (COD) trên toàn quốc." }
                  ].map((item, idx) => (
                    <div key={idx} className="p-8 bg-secondary/20 rounded-3xl hover:bg-secondary/40 transition-colors cursor-help">
                      <h4 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-3">
                        <MessageSquare size={16} className="text-accent" />
                        {item.q}
                      </h4>
                      <p className="text-sm text-primary/60 leading-relaxed pl-7">{item.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer Support */}
      <section className="py-24 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <h2 className="text-3xl font-black uppercase tracking-tighter">Vẫn còn thắc mắc?</h2>
          <div className="flex flex-wrap justify-center gap-6">
            <a href="tel:+84901234567" className="px-10 py-5 bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all font-black uppercase text-xs tracking-widest">
              Hotline: 0901 234 567
            </a>
            <a href="mailto:support@kredo.vn" className="px-10 py-5 bg-primary text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all font-black uppercase text-xs tracking-widest">
              Gửi Email cho chúng tôi
            </a>
          </div>
        </div>
      </section>

      <ChatBot/>
      <Contact/>
    </div>
  );
};

export default Policy;
