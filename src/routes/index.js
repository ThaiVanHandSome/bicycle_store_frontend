import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout";
import Home from "~/pages/Home";
import routes from "~/config/routes";
import Category from "~/pages/Category";
import Bicycle from "~/pages/Bicycle";
import Login from "~/pages/Login";
import Register from "~/pages/Register";
import ForgotPassword from "~/pages/ForgotPassword";
import Cart from "~/pages/Cart";
import Payment from "~/pages/Payment";
import UserInfomation from "~/pages/UserInfomation";
import NavBarLayout from "~/layouts/NavBarLayout";
import ChangePassword from "~/pages/ChangePassword";
import Purchase from "~/pages/Purchase";
import PurchaseDetail from "~/pages/PurchaseDetail/PurchaseDetail";
import Introduce from "~/pages/Introduce";
import Contact from "~/pages/Contact";
import Search from "~/pages/Search";

const publicRoutes = [
  {
    path: routes.home,
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: routes.category,
    component: Category,
    layout: DefaultLayout,
  },
  {
    path: routes.bicycle,
    component: Bicycle,
    layout: DefaultLayout
  },
  {
    path: routes.login,
    component: Login,
    layout: DefaultLayout
  },
  {
    path: routes.register,
    component: Register,
    layout: DefaultLayout
  },
  {
    path: routes.fotgotPassword,
    component: ForgotPassword,
    layout: DefaultLayout
  },
  {
    path: routes.cart,
    component: Cart,
    layout: DefaultLayout
  },
  {
    path: routes.payment,
    component: Payment,
    layout: DefaultLayout
  },
  {
    path: routes.user,
    component: UserInfomation,
    layout: NavBarLayout
  },
  {
    path: routes.changePassword,
    component: ChangePassword,
    layout: NavBarLayout
  },
  {
    path: routes.purchase,
    component: Purchase,
    layout: NavBarLayout
  },
  {
    path: routes.purchaseDetail,
    component: PurchaseDetail,
    layout: NavBarLayout
  },
  {
    path: routes.introduce,
    component: Introduce,
    layout: DefaultLayout
  },
  {
    path: routes.contact,
    component: Contact,
    layout: DefaultLayout
  },
  {
    path: routes.search,
    component: Search,
    layout: DefaultLayout
  }
];

export { publicRoutes };
