import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutation";
import { useEffect } from "react";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSideBar = () => {
  const { mutateAsync: signOut, isSuccess } = useSignOutAccount();
  const navigate = useNavigate();
  const {
    user: { id, imageUrl, username, name },
  } = useUserContext();

  const { pathname } = useLocation();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess, navigate]);
  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>
        <Link to={`/profile/${id}`} className="flex items-center gap-3">
          <img
            src={imageUrl || "/assets/icons/profile-placeholder.svg"}
            alt="profile-pic"
            className="h-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{name}</p>
            <p className="small-regular text-light-3">@{username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = link.route === pathname;
            return (
              <li
                className={`leftsidebar-link group ${isActive && "bg-primary-500"}`}
                key={link.label}
              >
                <NavLink
                  to={link.route}
                  className="flex items-center gap-4 p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={`${link.label}-img`}
                    // group-hover:invertwhite => what does it mean is if u hover on the parent element who contains (group) class the image whill have (invert-white) class
                    className={`group-hover:invert-white ${isActive && "invert-white"}`}
                  />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => signOut()}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSideBar;
