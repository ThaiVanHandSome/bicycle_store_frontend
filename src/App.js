import { BrowserRouter, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import { Fragment } from "react";

function App() {
  return (
    <>
      <BrowserRouter>
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
      </BrowserRouter>
    </>
  );
}

export default App;
