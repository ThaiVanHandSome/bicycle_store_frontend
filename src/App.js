import { Routes, Route, HashRouter } from "react-router-dom";
import { publicRoutes } from "./routes";
import { Fragment } from "react";

function App() {
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
