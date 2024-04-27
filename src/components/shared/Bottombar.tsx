import { bottombarLinks } from "@/constants";
import { INavLink } from "@/types";
import { Link, useLocation } from "react-router-dom";

const Bottombar = () => {
  const { pathname } = useLocation();
  return (
    <section className="bottom-bar">
      {bottombarLinks.map((link: INavLink) => {
        const isActive = link.route === pathname;
        return (
          <Link
            to={link.route}
            className={`flex-center flex-col items-center gap-2 rounded-[10px] p-2 transition sm:px-4 ${isActive && "bg-primary-500"}`}
            key={link.label}
          >
            <img
              src={link.imgURL}
              alt={`${link.label}-img`}
              // width={16}
              // height={16}
              className={`${isActive && "invert-white"} w-4 sm:w-6`}
            />
            <span className="tiny-medium sm:small-medium text-light-2">
              {link.label}
            </span>
          </Link>
        );
      })}
    </section>
  );
};

export default Bottombar;
