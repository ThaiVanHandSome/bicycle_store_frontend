function Contact() {
    return (
        <section className="mt-[100px]">
            <section style={{
                backgroundImage: "url(https://bicyclesport.monamedia.net/wp-content/uploads/2023/08/conntact_header.jpeg)",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }} className="h-[50vh] relative mb-10">
                <p className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-5xl font-bold text-white">Liên hệ</p>
            </section>
            <section className="px-2 lg:px-28">
                <p className="text-center font-semibold text-xl mb-4">
                    Xe đạp điện tử của chúng tôi cho phép bạn khám phá nhiều ngọn núi hơn và vượt qua nhiều vòng đua hơn bao giờ hết. Cảm giác tự nhiên, khả năng tăng tốc phù hợp với đường mòn sẽ giúp bạn leo lên và cho phép bạn trở thành con thoi của riêng mình.
                </p>
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/3 flex flex-col items-center justify-center px-2 mb-4 lg:mb-0">
                        <h1 className="text-lg font-bold mb-2">Ghé thăm địa điểm</h1>
                        <p className="text-center">1073/23 Cách Mạng Tháng 8, P.7, Q.Tân Bình, TP.HCM</p>
                    </div>
                    <div className="w-full lg:w-1/3 flex flex-col items-center justify-center px-2 mb-4 lg:mb-0">
                        <h1 className="text-lg font-bold mb-2">Hãy gọi cho chúng tôi</h1>
                        <p className="text-center">Điện thoại: (+84) 396 166 405</p>
                    </div>
                    <div className="w-full lg:w-1/3 flex flex-col items-center justify-center px-2">
                        <h1 className="text-lg font-bold mb-2">Tìm kiếm công việc?</h1>
                        <p className="text-center">Email: danitbadao1234@gmail.com</p>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default Contact;