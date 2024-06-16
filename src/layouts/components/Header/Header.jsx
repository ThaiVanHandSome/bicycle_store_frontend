import {
  faBars,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Listbox,
  ListboxItem,
  Tooltip,
} from "@nextui-org/react";
import { Drawer } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CartIcon, GlassIcon, UserIcon } from "~/components/Icon/Icon";
import routes from "~/config/routes";
import { useAuth } from "~/context/RefreshTokenContext";
import { useToast } from "~/context/ToastContext";
import { decodeJwtPayload } from "~/utils/jwt";

function Header() {
  const openNotification = useToast();
  const [startRefreshToken, stopRefreshToken] = useAuth();

  const [userInfo, setUserInfo] = useState(null);

  // Drawer of Bar Icon
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    stopRefreshToken();
    window.location.href = "http://localhost:3000/bicycle_store_frontend#/login";
    openNotification("success", "Thông báo", "Đăng xuất thành công!");
  }

  useEffect(() => {
    const jwt = localStorage.getItem("accessToken");
    if(jwt) {
      setUserInfo(decodeJwtPayload(jwt));
      console.log(decodeJwtPayload(jwt));
    }
  }, []);

  return (
    <section className="fixed left-0 right-0 top-0 z-30 min-h-[60px] bg-white xl:min-h-[100px] xl:shadow-lg">
      <div className="flex h-full w-full items-center justify-between px-[36px] xl:px-[64px]">
        {/* Bar */}
        <div className="header-icon xl:hidden" onClick={showDrawer}>
          <FontAwesomeIcon icon={faBars} size="lg" />
        </div>
        <Drawer
          title="Menu"
          placement="left"
          closable={false}
          onClose={onClose}
          open={open}
          key="left"
          className="relative p-0"
        >
          <FontAwesomeIcon
            icon={faXmark}
            className="absolute right-4 top-4 cursor-pointer text-2xl transition-all hover:rotate-90 hover:text-pri"
            onClick={onClose}
          />
          <Listbox className="m-[-12px] p-0">
            <ListboxItem>
              <a href="#" className="header-nav-item-bar">
                TRANG CHỦ
              </a>
            </ListboxItem>
            <ListboxItem>
              <a href="#" className="header-nav-item-bar">
                GIỚI THIỆU
              </a>
            </ListboxItem>
            <ListboxItem>
              <Link to={"/category/all"}  className="header-nav-item-bar">CỬA HÀNG</Link>
            </ListboxItem>
            <ListboxItem>
              <a href="#" className="header-nav-item-bar">
                CÂU HỎI THƯỜNG GẶP
              </a>
            </ListboxItem>
            <ListboxItem>
              <a href="#" className="header-nav-item-bar">
                LIÊN HỆ
              </a>
            </ListboxItem>
          </Listbox>
        </Drawer>

        <img
          alt="logo-bicycle"
          src="https://bicyclesport.monamedia.net/wp-content/uploads/2021/09/mona-2-1-e1704788512221.png"
          className="h-[56px] w-[56px] xl:h-[90px] xl:w-[90px]"
        />

        <nav className="hidden h-full xl:block">
          <ul className="flex h-full items-center">
            <li>
              <a href="#" className="header-nav-item">
                TRANG CHỦ
              </a>
            </li>
            <li>
              <a href="#" className="header-nav-item">
                GIỚI THIỆU
              </a>
            </li>
            <li>
              <Link
                to={"/category/all"}
                className="header-nav-item group relative block"
              >
                CỬA HÀNG
              </Link>
            </li>
            <li>
              <a href="#" className="header-nav-item">
                CÂU HỎI THƯỜNG GẶP
              </a>
            </li>
            <li>
              <a href="#" className="header-nav-item">
                LIÊN HỆ
              </a>
            </li>
          </ul>
        </nav>

        <div className="flex items-center justify-center">
          <div className="header-icon hidden xl:block">
            <Dropdown>
              <DropdownTrigger>
                <div>
                  {userInfo === null ? (
                    <UserIcon width={20} height={20} />
                  ) : (
                    <div className="flex items-center">
                      <img alt="avatar" className="w-[30px] rounded-full me-2" src={userInfo.avatar}/>
                      <p className="font-bold">{userInfo.firstName + " " + userInfo.lastName }</p>
                    </div>
                  )}
                </div>
              </DropdownTrigger>
              {localStorage.getItem("accessToken") ? (
                <DropdownMenu variant="faded" aria-label="Static Actions">
                  <DropdownItem className="border-0" key="copy" onClick={handleLogout}>
                    Đăng xuất
                  </DropdownItem>
                </DropdownMenu>
              ) : (
                <DropdownMenu variant="faded" aria-label="Static Actions">
                  <DropdownItem className="border-0" key="new">
                    <Link to={routes.login} className="w-full h-full block">Đăng nhập</Link>
                  </DropdownItem>
                  <DropdownItem className="border-0" key="copy">
                    <Link to={routes.register}  className="w-full h-full block">Đăng ký</Link>
                  </DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>
          </div>
          <div className="header-icon">
            <GlassIcon width={20} height={20} />
          </div>
          <div className="header-icon hidden xl:block">
            <Tooltip
              content={
                <div>
                  <h1>GIỎ HÀNG</h1>
                </div>
              }
            >
              <div>
                <Link to={routes.cart}>
                  <CartIcon width={22} height={22} /> 
                </Link>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Show on <= xl */}
      <div className="flex divide-x-1 xl:hidden">
        <div className="header-icon-not-xxl">
        <Dropdown>
              <DropdownTrigger>
                <div>
                  {userInfo === null ? (
                    <UserIcon width={20} height={20} />
                  ) : (
                    <div className="flex items-center">
                      <img alt="avatar" className="w-[30px] rounded-full me-2" src={userInfo.avatar}/>
                      <p className="font-bold">{userInfo.firstName + " " + userInfo.lastName }</p>
                    </div>
                  )}
                </div>
              </DropdownTrigger>
              {localStorage.getItem("accessToken") ? (
                <DropdownMenu variant="faded" aria-label="Static Actions">
                  <DropdownItem className="border-0" key="copy" onClick={handleLogout}>
                    Đăng xuất
                  </DropdownItem>
                </DropdownMenu>
              ) : (
                <DropdownMenu variant="faded" aria-label="Static Actions">
                  <DropdownItem className="border-0" key="new">
                    <Link to={routes.login} className="w-full h-full block">Đăng nhập</Link>
                  </DropdownItem>
                  <DropdownItem className="border-0" key="copy">
                    <Link to={routes.register}  className="w-full h-full block">Đăng ký</Link>
                  </DropdownItem>
                </DropdownMenu>
              )}
            </Dropdown>
        </div>
        <div className="header-icon-not-xxl">
          <CartIcon width={22} height={22} />
        </div>
      </div>
    </section>
  );
}

export default Header;
