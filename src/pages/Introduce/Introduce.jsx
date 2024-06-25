function Introduce() {
    return (
        <section className="mt-[100px]">
            <section style={{
                backgroundImage: "url(https://bicyclesport.monamedia.net/wp-content/uploads/2023/08/ab_header-e1704442111200.jpg)",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover"
            }} className="h-[100vh] relative mb-10">
                <p className="absolute top-1/2 left-[20px] -translate-y-1/2 text-5xl font-bold text-white">Hãy để chúng tôi giúp bạn <br></br> có được một cuộc phiêu lưu của cuộc đời</p>
            </section>
            <section className="flex flex-col lg:flex-row px-2 lg:px-28 mb-12">
                <div className="lg:w-1/2 w-full px-2 mb-4 lg:mb-0">
                    <h1 className="font-bold text-5xl mb-4">Về chúng tôi</h1>
                    <p className="mb-2">MONA cung cấp bánh xe carbon chắc chắn, nhẹ, bền cho mọi điều kiện—bao gồm xe đạp điện, xe leo núi và xe đường phố</p>
                    <h2 className="font-bold text-2xl mb-1">Chúng tôi cung cấp hướng dẫn tốt nhất cho bạn</h2>
                    <p className="mb-2">
                    Xe đạp nói riêng và các hoạt động thể chất ngoài trời nói chung là vô cùng cần thiết cho sự phát triển toàn diện của các bạn nhỏ cũng như người trưởng thành. Vận động không chỉ giúp nâng cao sức khỏe chống lại bệnh tật, mà còn giúp chúng ta có tinh thần hăng hái, học tập và làm việc hiệu quả hơn.
                    </p>
                    <h2 className="font-bold text-2xl mb-1">Mục tiêu của chúng tôi</h2>
                    <p>
                        Đạt chất lượng cao với giá thành hợp lý. Mở rộng thị trường với các dự án xuất khẩu ra nước ngoài.
                    </p>
                </div>
                <div className="flex items-center justify-center flex-1">
                    <img style={{
                        borderRadius: "0px 50px 0px 50px"
                    }} alt="bicycle" src="https://bicyclesport.monamedia.net/wp-content/uploads/2024/01/Loi-ich-cua-xe-dap-voi-moi-truong-e1704680585247.jpg"/>
                </div>
            </section>
            <section className="flex flex-col lg:flex-row px-2 lg:px-28 mb-12">
                <div className="lg:w-1/2 w-full flex items-center justify-center mb-4 lg:mb-0">
                    <img style={{
                            borderRadius: "0px 50px 0px 50px"
                        }} alt="bicycle" src="https://bicyclesport.monamedia.net/wp-content/uploads/2024/01/tai-sao-xe-dap-nui-la-bi-mat-tang-cuong-suc-manh-cua-triathlete-02-e1704680479851.jpg"/>
                </div>
                <div className="flex-1 flex items-center px-2">
                    <div>
                        <h1 className="font-bold text-5xl mb-4">Khách hàng của chúng tôi nói gì</h1>
                        <p className="mb-3">Mẫu mã đa dạng, nhiều lựa chọn, xe bền bỉ thuận tiện. MONA - người bạn đồng hành đáng tin cậy và luôn tin tưởng bạn trên mọi nẻo đường.</p>
                        <p className="font-bold text-lg">Thái Văn</p>
                        <p className="text-sm text-slate-500">FOUNDER & CEO</p>
                    </div>
                </div>
            </section>
        </section>
    );
}

export default Introduce;