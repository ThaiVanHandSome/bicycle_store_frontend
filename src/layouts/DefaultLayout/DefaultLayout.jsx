import Header from "../components/Header";
import Footer from "../components/Footer";

function DefaultLayout({ children }) {
  return (
    <section>
      <Header />
      <section className="mt-[100px]">{children}</section>
      <Footer />
    </section>
  );
}

export default DefaultLayout;
