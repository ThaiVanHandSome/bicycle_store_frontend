import Header from "../components/Header";
import Footer from "../components/Footer";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";

function DefaultLayout({ children }) {
  let location = useLocation();

  useEffect(() => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}, [location]);
  return (
    <section>
      <Header />
      <section className="mt-[100px]">{children}</section>
      <Footer />
    </section>
  );
}

export default DefaultLayout;
