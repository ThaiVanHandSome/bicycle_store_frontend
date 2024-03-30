import {
  faArrowCircleDown,
  faArrowCircleUp,
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
import { useState } from "react";
import { Link } from "react-router-dom";
import { CartIcon, GlassIcon, UserIcon } from "~/components/Icon/Icon";
import routes from "~/config/routes";
import { getAllCategories } from "~/services/apiServices/Category";

function Header() {
  const [categories, setCategories] = useState([]);
  const [openMenuInBar, setOpenMenuInBar] = useState(false);

  // Drawer of Bar Icon
  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  const handleGetCategories = async () => {
    if (categories.length !== 0) return;
    const res = await getAllCategories();
    setCategories(res || []);
  };

  return (
    <section className="fixed left-0 right-0 top-0 z-10 min-h-[60px] bg-white xl:min-h-[100px] xl:shadow-lg">
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
              <div
                className="header-nav-item-bar"
                onClick={() => {
                  setOpenMenuInBar((prev) => !prev);
                  handleGetCategories();
                }}
              >
                <div className="flex h-full w-full items-center justify-between">
                  <span>DANH MỤC</span>
                  {openMenuInBar ? (
                    <FontAwesomeIcon icon={faArrowCircleDown} />
                  ) : (
                    <FontAwesomeIcon icon={faArrowCircleUp} />
                  )}
                </div>
                {openMenuInBar && categories.length !== 0 && (
                  <div className="text-bold mt-2 rounded-md bg-white p-2 text-medium text-black">
                    <Listbox>
                      {categories.map((category, index) => (
                        <ListboxItem key={index}>
                          <Link to={`/category/${category.idBicycleCategory}`}>
                            {category.name}
                          </Link>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}
              </div>
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
              <a
                href="#"
                className="header-nav-item group relative block"
                onMouseEnter={handleGetCategories}
              >
                DANH MỤC
                {categories.length !== 0 && (
                  <div className="text-bold absolute left-0 top-full hidden rounded-md bg-white p-2 text-medium text-black shadow-lg group-hover:block">
                    <Listbox>
                      {categories.map((category, index) => (
                        <ListboxItem key={index}>
                          <Link to={`/category/${category.idBicycleCategory}`}>
                            {category.name}
                          </Link>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}
              </a>
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
                  <UserIcon width={20} height={20} />
                </div>
              </DropdownTrigger>
              <DropdownMenu variant="faded" aria-label="Static Actions">
                <DropdownItem className="border-0" key="new">
                  Đăng nhập
                </DropdownItem>
                <DropdownItem className="border-0" key="copy">
                  Đăng ký
                </DropdownItem>
              </DropdownMenu>
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
                <CartIcon width={22} height={22} />
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Show on <= xl */}
      <div className="flex divide-x-1 xl:hidden">
        <div className="header-icon-not-xxl">
          <UserIcon width={20} height={20} />
        </div>
        <div className="header-icon-not-xxl">
          <CartIcon width={22} height={22} />
        </div>
      </div>
    </section>
  );
}

export default Header;
