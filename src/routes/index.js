import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout";
import Home from "~/pages/Home";
import routes from "~/config/routes";
import Category from "~/pages/Category";
import Bicycle from "~/pages/Bicycle";
import Login from "~/pages/Login";
import Register from "~/pages/Register";
import ForgotPassword from "~/pages/ForgotPassword";
import Cart from "~/pages/Cart";

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
  }
];

export { publicRoutes };
