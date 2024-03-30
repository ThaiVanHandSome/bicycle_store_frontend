import DefaultLayout from "~/layouts/DefaultLayout/DefaultLayout";
import Home from "~/pages/Home";
import routes from "~/config/routes";

const publicRoutes = [
  {
    path: routes.home,
    component: Home,
    layout: DefaultLayout,
  },
];

export { publicRoutes };
