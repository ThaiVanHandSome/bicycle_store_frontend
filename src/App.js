import { Routes, Route, HashRouter } from "react-router-dom";
import { publicRoutes } from "./routes";
import { Fragment } from "react";

function App() {
  console.log(process.env.BASE_URL);
  return (
    <>
      <HashRouter>
        <Routes>
          {publicRoutes.map(({ path, component, layout }, index) => {
            const Layout = layout || Fragment;
            const Comp = component;
            return (
              <Route
                key={index}
                Component={() => (
                  <Layout>
                    <Comp />
                  </Layout>
                )}
                path={path}
              />
            );
          })}
        </Routes>
      </HashRouter>
    </>
  );
}

export default App;
