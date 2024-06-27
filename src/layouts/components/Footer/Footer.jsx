import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import routes from "~/config/routes";

function Footer() {
  const user = useSelector((state) => state.user.info);
  return (
    <section
      style={{
        backgroundImage: `url(${require("~/assets/images/footer/footer_bg.png")})`,
        backgroundColor: "#181A1B",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
      className="px-12 py-6 text-white"
    >
      <div>
        <div>
          <p className="text-center">Hello you! <Link to={routes.user} className="text-pri">{user?.email}</Link> </p>
          <p className="text-center">Copyright © 2024 by <span className="text-pri">Văn</span>. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}

export default Footer;
