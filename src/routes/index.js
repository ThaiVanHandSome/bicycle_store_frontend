import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout";
import Home from "~/pages/Home";
import routes from "~/config/routes";
import Category from "~/pages/Category";

const publicRoutes = [
  {
    path: routes.home,
    component: Home,
    layout: DefaultLayout,
  },
  {
    path: routes.categories,
    component: Category,
    layout: DefaultLayout,
  },
];

export { publicRoutes };
