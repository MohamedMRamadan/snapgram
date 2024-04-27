import { useUserContext } from "@/context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

function AuthLayout() {
  const { isAuthenticated } = useUserContext();

  return (
    <>
      {isAuthenticated ? (
        <Navigate replace to="/" />
      ) : (
        <>
          <section className="h-100 flex flex-1 items-center justify-center py-10">
            <Outlet />
          </section>
          <img
            className="hidden h-screen w-1/2 bg-no-repeat object-cover xl:block"
            src="/assets/images/side-img.svg"
            alt="side-img"
          />
        </>
      )}
    </>
  );
}

export default AuthLayout;
