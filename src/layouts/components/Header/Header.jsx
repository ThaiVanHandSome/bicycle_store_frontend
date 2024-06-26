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
  User,
} from "@nextui-org/react";
import { Drawer } from "antd";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { CartIcon, GlassIcon, UserIcon } from "~/components/Icon/Icon";
import routes from "~/config/routes";
import { useAuth } from "~/context/RefreshTokenContext";
import { useToast } from "~/context/ToastContext";
import { fetchCart } from "~/store/actions/cartAction";
import { fetchUser } from "~/store/actions/userAction";
import { clearUserInfo } from "~/store/user/userSlice";
import formatToVND from "~/utils/formatToVND";

function Header() {
  let location = useLocation();
  const openNotification = useToast();
  const [ _ , stopRefreshToken] = useAuth();

  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items); 
  const cartStatus = useSelector((state) => state.cart.status);
  const user = useSelector((state) => state.user.info);

  const [routeActive, setRouteActive] = useState(routes.user);

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
    localStorage.removeItem("idInterval");
    dispatch(fetchCart());
    dispatch(clearUserInfo());
    stopRefreshToken();
    window.location.href = process.env.BASE_URL + "/login";
    openNotification("success", "Thông báo", "Đăng xuất thành công!");
  }

  const handleGetInitData = async () => {
    const jwt = localStorage.getItem("accessToken");
    if(jwt) {
      dispatch(fetchCart());
      dispatch(fetchUser());
    }
  }

  const queryParams = new URLSearchParams();
  queryParams.append('page', 0);
  queryParams.append('size', 1);

  useEffect(() => {
    handleGetInitData();
  }, []);

  useEffect(() => {
    setRouteActive(location.pathname);
}, [location]);

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
              <a href="#" className={clsx("header-nav-item-bar", {
                "text-pri": routes.home === routeActive
              })}>
                TRANG CHỦ
              </a>
            </ListboxItem>
            <ListboxItem>
              <Link to={routes.introduce} className={clsx("header-nav-item-bar", {
                "text-pri": routes.introduce === routeActive
              })}>GIỚI THIỆU</Link>
            </ListboxItem>
            <ListboxItem>
              <Link to={"/category/all"}  className={clsx("header-nav-item-bar", {
                "text-pri": "/category/all" === routeActive
              })}>CỬA HÀNG</Link>
            </ListboxItem>
            <ListboxItem>
              <Link to={routes.contact} className={clsx("header-nav-item-bar", {
                "text-pri": routes.contact === routeActive
              })}>LIÊN HỆ</Link>
            </ListboxItem>
          </Listbox>
        </Drawer>

        <a href="#">
          <img
            alt="logo-bicycle"
            src="https://bicyclesport.monamedia.net/wp-content/uploads/2021/09/mona-2-1-e1704788512221.png"
            className="h-[56px] w-[56px] xl:h-[90px] xl:w-[90px]"
          />
        </a>

        <nav className="hidden h-full xl:block">
          <ul className="flex h-full items-center">
            <li>
              <a href="#" className={clsx("header-nav-item", {
                "text-pri": routes.home === routeActive
              })}>
                TRANG CHỦ
              </a>
            </li>
            <li>
              <Link to={routes.introduce} className={clsx("header-nav-item", {
                "text-pri": routes.introduce === routeActive
              })}>GIỚI THIỆU</Link>
            </li>
            <li>
              <Link
                to={"/category/all"}
                className={clsx("header-nav-item group relative block", {
                  "text-pri": "/category/all" === routeActive
                })}
              >
                CỬA HÀNG
              </Link>
            </li>
            <li>
              <Link to={routes.contact} className={clsx("header-nav-item", {
                "text-pri": routes.contact === routeActive
              })}>LIÊN HỆ</Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center justify-center">
          <div className="header-icon hidden xl:block">
            <Dropdown>
              <DropdownTrigger>
                <div>
                  {user === null ? (
                    <UserIcon width={20} height={20} />
                  ) : (
                    // <div className="flex items-center">
                    //   <img alt="avatar" className="w-[30px] h-[30px] rounded-full me-2" src={user.avatar}/>
                    //   <p className="font-bold text-pri">{user.firstName + " " + user.lastName }</p>
                    // </div>
                    <User name={user.firstName + " " + user.lastName } avatarProps={{
                      src: user.avatar
                    }}/>
                  )}
                </div>
              </DropdownTrigger>
              {localStorage.getItem("accessToken") ? (
                <DropdownMenu variant="faded" aria-label="Static Actions">
                  <DropdownItem className="border-0" key="user">
                    <Link to={routes.user} className="block w-full h-full">
                      Thông tin cá nhân
                    </Link>
                  </DropdownItem>
                  <DropdownItem className="border-0" key="user">
                    <Link to={routes.changePassword} className="block w-full h-full">
                      Thay đổi mật khẩu
                    </Link>
                  </DropdownItem>
                  <DropdownItem className="border-0" key="user">
                    <Link to={`/purchase?${queryParams.toString()}`} className="block w-full h-full">
                      Đơn hàng
                    </Link>
                  </DropdownItem>
                  <DropdownItem className="border-0" key="logout" onClick={handleLogout}>
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
                <>
                  {(items !== null && items.length !== 0) ? (
                    <>
                      <Listbox className="w-[500px] px-2 py-4" variant="bordered">
                        {
                          items.slice(0, 4).map((item) => (
                            <ListboxItem key={item.bicycle.idBicycle}>
                              <Link to={`/bicycle/${item.bicycle.idBicycle}`} className="w-full flex items-center">
                                <img className="w-[60px] me-3" src={item.bicycle.image} alt="bicycle-image"/>
                                <div className="w-[70%] text-wrap">
                                  <h2 className="font-bold text-pri text-md">{item.bicycle.name}</h2>
                                  <p className="text-sm text-slate-400">Màu sắc: {item.bicycleColor.name}</p>
                                  <p className="text-sm text-slate-400">Kích thước: {item.bicycleSize.name}</p>
                                </div>
                                <p className="font-bold text-red-600">{formatToVND(item.bicycle.price)}</p>
                              </Link>
                            </ListboxItem>
                          ))
                        }
                      </Listbox>
                      <Link to={routes.cart} className="px-2 py-1 text-white bg-pri rounded-md font-bold">Xem tất cả</Link>
                    </>
                  ) : (
                    <h1>No item.</h1>
                  )
                }
                </>
              }
            >
              <div>
                <Link to={routes.cart}>
                  <div className="relative">
                    <CartIcon width={22} height={22} />
                    {
                      cartStatus === "succeeded" && (
                        <p className="absolute -top-1/2 -right-1/2 w-[20px] h-[20px] text-sm font-bold bg-white text-red-600 rounded-full flex items-center justify-center shadow-md">{items.length > 9 ? "9+" : items.length}</p> 
                      )
                    }
                  </div>
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
                  {user === null ? (
                    <UserIcon width={20} height={20} />
                  ) : (
                    // <div className="flex items-center">
                    //   <img alt="avatar" className="w-[30px] h-[30px] rounded-full me-2" src={user.avatar}/>
                    //   <p className="font-bold text-pri">{user.firstName + " " + user.lastName }</p>
                    // </div>
                    <User name={user.firstName + " " + user.lastName } avatarProps={{
                      src: user.avatar
                    }}/>
                  )}
                </div>
              </DropdownTrigger>
              {localStorage.getItem("accessToken") ? (
                <DropdownMenu variant="faded" aria-label="Static Actions">
                  <DropdownItem className="border-0" key="user">
                    <Link to={routes.user} className="block w-full h-full">
                      Thông tin cá nhân
                    </Link>
                  </DropdownItem>
                  <DropdownItem className="border-0" key="user">
                    <Link to={routes.changePassword} className="block w-full h-full">
                      Thay đổi mật khẩu
                    </Link>
                  </DropdownItem>
                  <DropdownItem className="border-0" key="user">
                    <Link to={routes.purchase} className="block w-full h-full">
                      Đơn hàng
                    </Link>
                  </DropdownItem>
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
        <Link to={routes.cart} className="header-icon-not-xxl">
          <CartIcon width={22} height={22} />
        </Link>
      </div>
    </section>
  );
}

export default Header;
