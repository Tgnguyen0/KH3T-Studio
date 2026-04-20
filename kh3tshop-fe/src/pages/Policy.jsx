import React from "react";
// Đã xóa import Accordion: import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; (Đã bị loại bỏ để dọn dẹp)
import { Package, Shield, Truck, RefreshCw, AlertCircle, Mail, Phone, MapPin } from "lucide-react";
import ChatBot from "../components/ChatBot"; 
import Contact from "../components/Contact";
const Policy = () => {
  const headerImage = "https://i.postimg.cc/nLLky3D0/Frame-1000004547.png";

  const conditions = [
    {
      icon: <Package className="w-8 h-8" />,
      title: "Condition of Item",
      description: "Items must be unused, unwashed, and free of any odors (body odor, perfume, chemicals, etc.)."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Tags and Labels",
      description: "Tags and labels must remain intact, not be torn, removed, or altered."
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Original Packaging",
      description: "The item must be returned with all original packaging and accessories in the same condition it was received."
    }
  ];

  const freeReturnCases = [
    {
      title: "Manufacturer Defects",
      description: "Items with verifiable manufacturer defects (e.g., torn seams, dye/print issues, poor workmanship).",
      icon: <AlertCircle className="w-6 h-6" />
    },
    {
      title: "Incorrect Item Sent",
      description: "Items sent incorrectly (wrong size, color, or product) compared to the original order.",
      icon: <RefreshCw className="w-6 h-6" />
    },
    {
      title: "Out of Stock for Exchange",
      description: "If a size exchange is requested, but the item is confirmed to be out of stock.",
      icon: <Package className="w-6 h-6" />
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Hero Image at Top */}
        <div className="mb-20 rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={headerImage}
            alt="KH3T Policy Header"
            className="w-full h-[300px] object-cover mx-auto"
          />
        </div>

        {/* Page Header */}
        <header className="text-center mb-20 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-foreground tracking-tighter">
            Return & Exchange Policy
          </h1>
          <p className="text-xl text-muted-foreground mt-4 max-w-4xl mx-auto leading-relaxed">
            At KH3T Studio, we aim to provide a diverse and trendy fashion shopping experience. If you encounter any issues with your purchase, we are here to help.
          </p>
        </header>

        {/* Eligibility Period Section */}
        <section className="mb-40 py-20 bg-[#F5F4F0] animate-fade-in">
          <div className="relative max-w-3xl mx-auto">
            <div className="p-8 bg-foreground rounded-xl shadow-2xl text-center transform transition-all duration-500 hover:scale-[1.03] hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-white">15</span>
                </div>
              </div>
              <h2 className="text-3xl font-bold text-background mb-3">Eligibility Period</h2>
              <p className="text-lg text-background/80">
                15 days from the date the customer receives the product (based on delivery carrier confirmation).
              </p>
            </div>
          </div>
        </section>

        {/* Mandatory Conditions Section */}
        <section className="mb-40">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">Mandatory Return/Exchange Conditions</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            For a return or exchange to be accepted, the item must meet all of the following conditions:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {conditions.map((condition, index) => (
              <div
                key={index}
                className="group relative p-6 bg-muted rounded-xl shadow-lg border-t-4 border-foreground
                          transition-all duration-500 hover:bg-black hover:shadow-2xl hover:scale-[1.05] hover:-translate-y-2 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4 text-red-500 group-hover:text-white transition-colors duration-300">
                  {condition.icon}
                </div>
                <h3 className="text-xl font-bold text-foreground text-center mb-3 group-hover:text-white transition-colors duration-300">
                  {condition.title}
                </h3>
                <p className="text-muted-foreground text-center group-hover:text-white/80 transition-colors duration-300">
                  {condition.description}
                </p>
              </div>
            ))}
          </div>

          {/* Important Note */}
          <div className="mt-12 p-6 bg-accent rounded-xl shadow-lg border-l-4 border-red-500 max-w-4xl mx-auto 
                transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 animate-fade-in
                /* CÁC THAY ĐỔI ĐÃ ÁP DỤNG */
                hover:bg-green-500 
                hover:text-white 
                hover:border-white">
    <div className="flex items-start gap-4">
        {/* Thêm lớp hover:text-white để đổi màu Icon */}
        <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1 hover:text-white hidden" />
        <div>
            <h3 className="text-lg font-bold text-accent-foreground mb-2 hover:text-white">📝 IMPORTANT NOTE</h3>
            <p className="text-accent-foreground/90 hover:text-white/90">
                KH3T Studio strongly recommends recording an unboxing video upon receiving the package to serve as valid proof for any future claims.
            </p>
        </div>
    </div>
</div>
        </section>

        {/* Free Return Cases Section */}
        <section className="mb-40 py-20 bg-[#F5F4F0] animate-fade-in">
          <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Eligible Return/Exchange Cases
          </h2>
          <p className="text-center text-green-600 font-semibold mb-12 text-lg">
            ✓ Free Return Shipping One-Way
          </p>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            {freeReturnCases.map((item, index) => (
              <div
                key={index}
                className="group p-6 bg-muted rounded-xl shadow-lg border-l-4 border-foreground/70
                          transition-all duration-500 hover:bg-black hover:border-red-500 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-red-500 group-hover:text-white transition-colors duration-300 mt-1">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-white transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-8 italic">
            KH3T Studio will cover all shipping costs incurred for the return or exchange in these cases.
          </p>
          </div>
        </section>

        {/* Customer Paid Shipping Section */}
        <section className="mb-40">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Cases Subject to Customer-Paid Shipping Fees
          </h2>
          
          <div className="max-w-3xl mx-auto">
            <div className="p-6 bg-accent rounded-xl shadow-lg border-l-4 border-accent-foreground transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 animate-fade-in">
              <div className="flex items-start gap-4">
                <Truck className="w-6 h-6 text-accent-foreground flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-bold text-accent-foreground mb-2">Size Exchange</h3>
                  <p className="text-accent-foreground/90">
                    Size exchange if the item does not fit (subject to availability).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Request Template Section - ĐÃ CHUYỂN THÀNH HIỂN THỊ TĨNH */}
        <section className="mb-40 py-20 bg-[#F5F4F0] animate-fade-in">
          <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Customer Return/Exchange Request Form
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            To ensure the fastest support, please copy and fill in the following template with all required details, then send it via Email or contact our Hotline.
          </p>
          
          <div className="max-w-4xl mx-auto">
            {/* THAY THẾ TOÀN BỘ CẤU TRÚC ACCORDION BẰNG DIV TĨNH */}
            <div className="w-full">
              {/* HEADER (THAY CHO AccordionTrigger) */}
              <div className="p-8 bg-foreground rounded-t-xl shadow-2xl transition-all duration-300">
                <h3 className="text-2xl font-bold text-background flex items-center gap-3">
                  <Package className="w-7 h-7" />
                  KH3T STUDIO RETURN/EXCHANGE REQUEST TEMPLATE
                </h3>
              </div>

              {/* CONTENT (THAY CHO AccordionContent) */}
              <div className="p-0">
                <div className="bg-muted p-8 rounded-b-xl shadow-2xl border-t-2 border-background/10">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 bg-background rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                        <p className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                          <span className="text-red-500">•</span> Customer Full Name:
                        </p>
                        <p className="text-muted-foreground text-sm pl-4">[Enter your full name]</p>
                      </div>
                      <div className="p-4 bg-background rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                        <p className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                          <span className="text-red-500">•</span> Contact Phone Number:
                        </p>
                        <p className="text-muted-foreground text-sm pl-4">[Enter Phone Number]</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                      <p className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                        <span className="text-red-500">•</span> Order Number:
                      </p>
                      <p className="text-muted-foreground text-sm pl-4">[Example: KH3T-20250101]</p>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                      <p className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                        <span className="text-red-500">•</span> Product Name:
                      </p>
                      <p className="text-muted-foreground text-sm pl-4">[Example: Basic Round Neck T-Shirt - White]</p>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                      <p className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                        <span className="text-red-500">•</span> Reason for Request:
                      </p>
                      <p className="text-muted-foreground text-sm pl-4">Select one: Size Exchange / Manufacturer Defect / Wrong Item Sent / Return for Refund.</p>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                      <p className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                        <span className="text-red-500">•</span> Detailed Issue/Request:
                      </p>
                      <p className="text-muted-foreground text-sm pl-4">[Describe the issue in detail. E.g., The shirt has a torn seam on the shoulder; Wrong size L sent instead of M; Requesting to exchange size M for size L.]</p>
                    </div>
                    
                    <div className="p-4 bg-background rounded-lg shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1">
                      <p className="font-bold text-foreground text-sm mb-2 flex items-center gap-2">
                        <span className="text-red-500">•</span> Attachments:
                      </p>
                      <p className="text-muted-foreground text-sm pl-4">[Attach photos of the product fault and the Unboxing Video (if available).]</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="mb-40">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Contact Information
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-3xl mx-auto">
            For all questions, return/exchange inquiries, or complaints, please contact our Customer Service team via the channels below:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="group p-6 bg-muted rounded-xl shadow-lg text-center transition-all duration-500 hover:bg-black hover:shadow-2xl hover:scale-[1.05] hover:-translate-y-2 animate-fade-in">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-white transition-colors duration-300">
                Support Email
              </h3>
              <p className="text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                support@kh3tstudio.com
              </p>
            </div>

            <div className="group p-6 bg-muted rounded-xl shadow-lg text-center transition-all duration-500 hover:bg-black hover:shadow-2xl hover:scale-[1.05] hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                  <Phone className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-white transition-colors duration-300">
                Hotline/Zalo
              </h3>
              <p className="text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                +84 901 234 567
              </p>
            </div>

            {/* Đã sửa cấu trúc thẻ để nội dung hiển thị đúng */}
            <div className="group p-6 bg-muted rounded-xl shadow-lg text-center transition-all duration-500 hover:bg-black hover:shadow-2xl hover:scale-[1.05] hover:-translate-y-2 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-white transition-colors duration-300">
                Return Warehouse
              </h3>
              <p className="text-muted-foreground group-hover:text-white/80 transition-colors duration-300">
                [Detailed address for returns]
              </p>
            </div>
          </div>
        </section>

        {/* Commitment Section */}
        <section className="mb-20 py-20 bg-[#F5F4F0] animate-fade-in">
          <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-foreground mb-8">
            Commitment & Right to Refuse
          </h2>
          
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="p-6 bg-accent rounded-xl shadow-lg border-l-4 border-green-500 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 animate-fade-in">
              <h3 className="text-xl font-bold text-accent-foreground mb-2">Our Commitment</h3>
              <p className="text-accent-foreground/90">
                We are committed to providing fast and reliable support upon receiving your inquiry.
              </p>
            </div>

            <div className="p-6 bg-accent rounded-xl shadow-lg border-l-4 border-red-500 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h3 className="text-xl font-bold text-accent-foreground mb-2">Right to Refuse</h3>
              <p className="text-accent-foreground/90">
                KH3T Studio reserves the right to reject returns that do not meet the mandatory conditions listed above.
              </p>
            </div>
          </div>
          </div>
        </section>

      </div>
      <ChatBot/>
      <Contact/>
    </div>
  );
};

export default Policy;