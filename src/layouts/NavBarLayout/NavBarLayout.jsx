import { Link, useLocation } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import routes from "~/config/routes";
import { UserIcon } from "~/components/Icon/Icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMoneyBillAlt, faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState } from "react";
import clsx from "clsx";

function NavBarLayout({ children }) {
    let location = useLocation();

    const queryParams = new URLSearchParams();
    queryParams.append('page', 0);
    queryParams.append('size', 1);
    
    const [routeActive, setRouteActive] = useState(routes.user);
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        setRouteActive(location.pathname);
    }, [location]);

    return (
        <section>
            <Header />
            <section className="w-full flex mt-[100px]">
                <nav className="hidden lg:flex w-[400px] flex-col py-6 px-12 bg-gray-200 me-4">
                    <Link className={clsx("flex items-center w-full font-bold mb-2 hover:text-pri transition-all", {
                        "text-pri": routeActive === routes.user
                    })} to={routes.user}>
                        <UserIcon className="me-2" width={20} height={20}/>
                        <span>Thông tin cá nhân</span>
                    </Link>
                    <Link className={clsx("flex items-center w-full font-bold mb-2 hover:text-pri transition-all", {
                        "text-pri": routeActive === routes.changePassword
                    })} to={routes.changePassword}>
                        <FontAwesomeIcon className="me-2 text-xl" icon={faPenToSquare}/>
                        <span>Đổi mật khẩu</span>
                    </Link>
                    <Link className={clsx("flex items-center w-full font-bold mb-2 hover:text-pri transition-all", {
                        "text-pri": routeActive === routes.purchase
                    })} to={`/purchase?${queryParams.toString()}`}>
                        <FontAwesomeIcon className="me-2 text-xl" icon={faMoneyBillAlt}/>
                        <span>Đơn hàng</span>
                    </Link>
                </nav>
                <section className="flex-1 w-full">
                    { children }
                </section>
            </section>
            <Footer />
        </section>
    );
}

export default NavBarLayout;