import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout";
import Home from "~/pages/Home";
import routes from "~/config/routes";
import Category from "~/pages/Category";
import Bicycle from "~/pages/Bicycle";

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
  }
];

export { publicRoutes };
