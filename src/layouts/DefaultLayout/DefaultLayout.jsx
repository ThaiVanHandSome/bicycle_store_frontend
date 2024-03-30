import Header from "../components/Header";
import Footer from "../components/Footer";

function DefaultLayout({ children }) {
  return (
    <section>
      <Header />
      <section>{children}</section>
      <Footer />
    </section>
  );
}

export default DefaultLayout;
