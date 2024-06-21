function Footer() {
  return (
    <section
      style={{
        backgroundImage: `url(${require("~/assets/images/footer/footer_bg.png")})`,
        backgroundColor: "#181A1B",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="px-12 py-6 text-white"
    >
      <div className="flex w-full flex-wrap justify-center">
        <div className="footer-block">
          <div>
            <h1 className="footer-heading">VỀ CHÚNG TÔI</h1>
            <p className="text-center">
              Chúng tôi là một nhóm các nhà thiết kế và phát triển tạo ra
              WordPress, Magento, Prestashop, Opencart chất lượng cao
            </p>
            {/* <ul>
              <li>
                <a href="#">
                  <FontAwesomeIcon icon={faYo} />
                </a>
              </li>
            </ul> */}
          </div>
        </div>
        <div className="footer-block">
          <div>
            <h1 className="footer-heading">THÔNG TIN</h1>
            <ul>
              <li>
                <a href="#" className="footer-link">
                  Thông tin giao hàng
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Điều khoản và điều kiện
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Liên hệ
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Hoàn trả
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Về chúng tôi
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-block">
          <div>
            <h1 className="footer-heading">TÀI KHOẢN CỦA TÔI</h1>
            <ul>
              <li>
                <a href="#" className="footer-link">
                  Tài khoản của tôi
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Lịch sử đơn hàng
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Danh sách yêu thích
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Đang vận chuyển
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Câu hỏi thường gặp
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-block">
          <div>
            <h1 className="footer-heading">NGƯỜI DÙNG HỮU ÍCH</h1>
            <ul>
              <li>
                <a href="#" className="footer-link">
                  Cộng đồng
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Diễn đàn
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Gặp gỡ
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Trung tâm trợ giúp
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Thiết kế sáng tạo
                </a>
              </li>
              <li>
                <a href="#" className="footer-link">
                  Thiết kế UX/UI
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Footer;
