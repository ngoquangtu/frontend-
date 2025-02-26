import { Button, Carousel } from "antd"
import logo from "../../public/logo.svg";
import { useState } from "react";
import { FaClock, FaDollarSign, FaHeadSideVirus } from "react-icons/fa";

const contentStyle: React.CSSProperties = {
  height: '300px', // Tăng chiều cao
  color: '#fff',
  lineHeight: '300px',
  textAlign: 'center',
  background: '#364d79',
  borderRadius: '20px', // Bo góc
};
const serviceIcons = [
  { text: "Takes your time.", icon: "⏳" },
  { text: "Kills your profits.", icon: "💸" },
  { text: "Gives your headaches.", icon: "🤯" }
];
const existingSolutions = [
  { text: "Doing yourself?", icon: "🔧" }, // 
  { text: "Hiring an agency?", icon: "🏢" }, // 
  { text: "Most PPC tools", icon: "📊" } // 
];


export default function LandingPage() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const toggleBilling = () => {
    setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly");

  };
  const icons = [FaClock, FaDollarSign, FaHeadSideVirus];
  return (
    <div className="flex flex-col min-h-screen w-full bg-gray-50">
      <header className="bg-white shadow-md rounded-3xl p-2 mb-2 mt-4 h- mx-4">
        <div className="w-full mx-auto flex justify-between items-center px-6 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="https://mangoags.com/static/logo.svg" alt="MangoAGSLogo" className="w-10 h-10" />
            <span className="text-xl font-bold text-black">Mango AGS</span>
          </div>

          {/* Navigation (Ẩn trên màn hình nhỏ) */}
          <nav className="hidden md:block mx-auto">
            <ul className="flex space-x-6 text-black font-medium">
              <li>
                <a href="#about" className="hover:text-gray-500">
                  About us
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-gray-500">
                  Services
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-gray-500">
                  Contact
                </a>
              </li>
              <li className="flex items-center space-x-1">
                <img
                  src="https://img.freepik.com/free-vector/illustration-uk-flag_53876-18166.jpg"
                  alt="EN"
                  className="w-7"
                />
                <span>EN</span>
              </li>
            </ul>
          </nav>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            {/* Button Đăng nhập */}
            <button className="border border-black bg-white text-black px-4 py-2 rounded-full hover:bg-gray-200">
              Log in
            </button>
            {/* Button Dùng thử miễn phí */}
            <button className="bg-[#33A852] text-white px-4 py-2 rounded-full hover:bg-[#2A8C45]">
              Try for free
            </button>
          </div>

        </div>
      </header>



      {/* Main */}
      <main className="flex-grow w-full">

        {/* Hero Section */}
        <section id="hello" className="bg-white shadow-md rounded-3xl p-2 mb-6 mt-6 min-h-[400px] mx-4 flex flex-col justify-center items-center text-center">
          <h1 className="text-6xl font-bold mb-4 text-orange-500">Chào Mừng Đến Với Mango AGS</h1>
          <p className="text-xl mb-8">Giải Pháp Công Nghệ Thông Minh Cho Doanh Nghiệp Của Bạn</p>
          <Button className="bg-white text-orange-500 hover:bg-orange-100">Tìm Hiểu Thêm</Button>
        </section>

        {/* About */}
        {/* About Us */}
        <section id="about" className="bg-white shadow-md rounded-3xl p-2 mb-6 mt-6 min-h-[400px] mx-4 flex flex-col justify-center items-center text-center">
          <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img src="https://mangoags.com/static/logo.svg" alt="About Mango AGS" width={400} height={300} className="rounded-lg mx-auto" />
            </div>
            <div className="md:w-1/2 md:pl-8 text-orange-400">
              <h2 className="text-3xl font-bold mb-6 text-center ">Về Chúng Tôi</h2>
              <p className="text-lg mb-4 ">
                Mango AGS là công ty hàng đầu trong lĩnh vực công nghệ thông tin, cung cấp các giải pháp sáng tạo và hiệu quả cho doanh nghiệp của bạn.
              </p>
              <Button className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white">Xem Thêm</Button>
            </div>
          </div>
        </section>

        {/* Warning */}
        <section id="services" className="bg-[#CC2D12] shadow-md rounded-3xl p-10 mb-10 mt-10 min-h-[200px] mx-4 flex flex-col justify-center items-center text-center">
          <div className="mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-white">Amazon Ads can kill your business!</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 w-full">
              {serviceIcons.map((service, index) => (
                <div key={index} className="bg-white p-10 rounded-xl shadow-lg min-h-[250px] flex flex-col justify-center items-center text-center">
                  <span className="text-5xl mb-4">{service.icon}</span>
                  <h3 className="text-2xl font-bold mb-4 text-black">{service.text}</h3>
                  <p className="text-gray-700 text-lg">
                    Chúng tôi cung cấp dịch vụ {service.text.toLowerCase()} chất lượng cao, đáp ứng mọi nhu cầu của doanh nghiệp bạn.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* Existing solutions */}


        <section id="services" className="bg-[#26262A] shadow-md rounded-3xl p-10 mb-10 mt-10 min-h-[200px] mx-4 flex flex-col justify-center items-center text-center">
          <div className="mx-auto text-center">
            <h2 className="text-4xl font-bold mb-12 text-white">Existing solutions don't fit.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-12 gap-y-12 w-full">
              {existingSolutions.map((solution, index) => (
                <div key={index} className="bg-white p-10 rounded-xl shadow-lg min-h-[250px] flex flex-col justify-center items-center text-center">
                  <span className="text-5xl mb-4">{solution.icon}</span>
                  <h3 className="text-2xl font-bold mb-4 text-black">{solution.text}</h3>
                  <p className="text-gray-700 text-lg">
                    Chúng tôi cung cấp dịch vụ {solution.text.toLowerCase()} chất lượng cao, đáp ứng mọi nhu cầu của doanh nghiệp bạn.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our solution */}
        <section className="bg-[#17A54C] shadow-md rounded-3xl p-6 mb-6 mt-6 mx-4 min-h-[400px]">
          <h2 className="text-4xl font-bold mb-6 mt-6 text-white text-center">We built the right solution.</h2>
          <h3 className="text-xl  mb-10 mt-6 text-white text-center">Made with +100 sellers and agencies.</h3>
          <Carousel autoplay autoplaySpeed={3000}>
            <div>
              <h3 style={contentStyle}>Slide 1</h3>
            </div>
            <div>
              <h3 style={contentStyle}>Slide 2</h3>
            </div>
            <div>
              <h3 style={contentStyle}>Slide 3</h3>
            </div>
          </Carousel>
          <div className="mb-2 mt-6 text-white text-center">
            {/* Button Dùng thử miễn phí */}
            <button className="bg-black text-white px-8 font-bold py-5 rounded-full text-3x1 hover:bg-gray-800">
              Start now!
            </button>
          </div>
          <h6 className="text-sm mb-6 mt-6 text-white text-center">No credit card required.</h6>

        </section>

        {/* Save time */}
        <section id="about" className="bg-white shadow-md rounded-3xl p-2 mb-6 mt-6 min-h-[400px] mx-4 flex flex-col justify-center ">
          <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row ">
            {/* Nội dung chữ đặt trước */}
            <div className="md:w-1/2 md:pr-8 text-black ">
              <h2 className="text-5xl font-bold mb-6">
                Save time <span className="text-green-600">now.</span>
              </h2>
              <div className="text-left text-lg">
                <div className="flex items-start mb-4">

                  <div>
                    <h3 className="font-semibold text-black">Start in 5 minutes.</h3>
                    <p className="text-gray-600">
                      Just apply the recommended ready-to-use strategy to get optimisation suggestions within 2 minutes.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">

                  <div>
                    <h3 className="font-semibold text-black">Fit with your ads</h3>
                    <p className="text-gray-600">
                      Smart bid adjustment that fits with your specific ads. Works with your existing campaigns.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hình ảnh đặt sau */}
            <div className="md:w-1/2 mb-8 mt-6 md:mb-0">
              <video width={1000} height={1000} className="rounded-lg mx-auto" controls autoPlay loop muted>
                <source src="https://ppcassist.com/videos/apply_strat_en.mp4" type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
          </div>
        </section>
        {/* keep control */}
        <section id="control" className="bg-white shadow-md rounded-3xl p-6 mb-6 mt-6 min-h-[400px] mx-4 flex flex-col justify-center">
          <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center gap-8">
            {/* Hình ảnh đặt sau */}
            <div className="md:w-1/2 mb-8 md:mb-0">
              <video width={1000} height={1000} className="rounded-lg mx-auto" controls autoPlay loop muted>
                <source src="https://ppcassist.com/videos/validate_suggestion_en.mp4" type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
            {/* Nội dung chữ */}
            <div className="md:w-1/2 md:pr-8 text-black">
              <h2 className="text-5xl font-bold mb-4">
                Keep <span className="text-green-600">full control.</span>
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                No risk. No costly blind decision. Get suggestions that you can validate, automate or ignore.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-gray-100 rounded-full font-medium text-sm">✅ Semi-auto mode</span>
                <span className="px-4 py-2 bg-gray-100 rounded-full font-medium text-sm">✅ Confirmation mode</span>
                <span className="px-4 py-2 bg-gray-100 rounded-full font-medium text-sm">✅ Rules + AI + Human Control</span>
              </div>
            </div>
          </div>
        </section>
        {/* Your are guided */}
        <section id="about" className="bg-white shadow-md rounded-3xl p-6 mb-6 mt-6 min-h-[400px] mx-4 flex flex-col justify-center">
          <div className="max-w-screen-lg mx-auto flex flex-col md:flex-row items-center gap-8">
            {/* Nội dung chữ đặt trước */}
            <div className="md:w-1/2 md:pr-8 text-black">
              <h2 className="text-5xl font-bold mb-6">
                You are <span className="text-green-600">guided.</span>
              </h2>
              <div className="text-left text-lg space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-green-600 text-2xl">📚</span>
                  <div>
                    <h3 className="font-semibold text-black">Free courses & tutorials</h3>
                    <p className="text-gray-600">Short videos to know what to do based on your situation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-green-600 text-2xl">📞</span>
                  <div>
                    <h3 className="font-semibold text-black">Free onboarding call</h3>
                    <p className="text-gray-600">Get a free 30-minute onboarding/consultation call.</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-green-600 text-2xl">💬</span>
                  <div>
                    <h3 className="font-semibold text-black">Human chat</h3>
                    <p className="text-gray-600">Any question? Chat with a real human that answers in less than an hour (14 min on average).</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Hình ảnh đặt sau */}
            <div className="md:w-1/2">
              <video width={1000} height={1000} className="rounded-lg mx-auto" controls autoPlay loop muted>
                <source src="your-video-url.mp4" type="video/mp4" />
                Trình duyệt của bạn không hỗ trợ video.
              </video>
            </div>
          </div>
        </section>


        {/* Services */}
        <section id="services" className="bg-white shadow-md rounded-3xl p-2 mb-6 mt-6 min-h-[400px] mx-4 flex flex-col justify-center items-center text-center">
          <div className="max-w-screen-lg mx-auto text-center">
            <h2 className="text-3xl font-bold mb-12">Grow your ads, in one place.</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
              {["Phát Triển Phần Mềm", "Tư Vấn IT", "Bảo Mật Thông Tin"].map((service, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-semibold mb-4">{service}</h3>
                  <p className="text-gray-600">
                    Chúng tôi cung cấp dịch vụ {service.toLowerCase()} chất lượng cao, đáp ứng mọi nhu cầu của doanh nghiệp bạn.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>



        {/* Contact */}
        <section id="contact" className="bg-white shadow-md rounded-3xl p-2 mb-6 mt-6 min-h-[400px] mx-4 flex flex-col justify-center items-center text-center">
          <div className="max-w-screen-lg mx-auto text-center text-orange-400">
            <h2 className="text-3xl font-bold mb-8">Liên Hệ Với Chúng Tôi</h2>
            <p className="text-lg mb-8">Hãy liên hệ với chúng tôi để được tư vấn miễn phí về giải pháp phù hợp cho doanh nghiệp của bạn.</p>
            <Button className="bg-orange-500 text-white hover:bg-orange-600">Liên Hệ Ngay</Button>
          </div>
        </section>

      </main>

      {/* Footer */}
      {/* Footer */}
      <footer className="bg-gray-800 text-orange-400 py-8 w-full text-center">
        <div className="max-w-screen-lg mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-left px-6">
          <div>
            <h3 className="font-bold mb-2">Social</h3>
            <ul>
              <li>LinkedIn</li>
              <li>Youtube</li>
              <li>Twitter</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Apps</h3>
            <ul>
              <li>iPhone</li>
              <li>Android</li>
              <li>Amazon App US</li>
              <li>Amazon App Europe</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Resources</h3>
            <ul>
              <li>Privacy Policies</li>
              <li>Contact Us</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-2">Alternative to</h3>
            <ul>
              <li>m19</li>
              <li>Helium10 AdTomic</li>
              <li>ShopKeeper</li>
              <li>aiHello</li>
              <li>Perpetua (ex Sellics)</li>
            </ul>
          </div>
        </div>
        <p className="mt-6">&copy; 2025 Mango AGS. Tất cả quyền được bảo lưu.</p>
      </footer>

    </div>
  )
}

// Removed the conflicting local useState function
