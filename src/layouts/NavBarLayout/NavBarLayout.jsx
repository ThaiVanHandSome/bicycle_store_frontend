import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import routes from "~/config/routes";
import { UserIcon } from "~/components/Icon/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillAlt, faPenToSquare } from "@fortawesome/free-regular-svg-icons";

function NavBarLayout({ children }) {
    return (
        <section>
            <Header />
            <section className="flex mt-[100px] px-12 py-6">
                <nav className="w-[400px] flex flex-col py-4 px-12">
                    <Link className="flex items-center w-full font-bold mb-2 hover:text-pri transition-all" to={routes.user}>
                        <UserIcon className="me-2" width={20} height={20}/>
                        <span>Thông tin cá nhân</span>
                    </Link>
                    <Link className="flex items-center w-full font-bold mb-2 hover:text-pri transition-all" to={routes.changePassword}>
                        <FontAwesomeIcon width={20} height={20} className="me-2" icon={faPenToSquare}/>
                        <span>Đổi mật khẩu</span>
                    </Link>
                    <Link className="flex items-center w-full font-bold mb-2 hover:text-pri transition-all" to={routes.purchase}>
                        <FontAwesomeIcon width={20} height={20} className="me-2" icon={faMoneyBillAlt}/>
                        <span>Đơn hàng</span>
                    </Link>
                    <Link className="flex items-center w-full font-bold mb-2 hover:text-pri transition-all">Sản phẩm yêu thích</Link>
                </nav>
                <section className="flex-1">
                    { children }
                </section>
            </section>
            <Footer />
        </section>
    );
}

export default NavBarLayout;