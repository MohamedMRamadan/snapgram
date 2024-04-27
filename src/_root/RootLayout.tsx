import Bottombar from "@/components/shared/Bottombar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import Topbar from "@/components/shared/Topbar";
import { Outlet } from "react-router-dom";

function RootLayout() {
  return (
    <div className="w-full md:flex">
      <Topbar />
      <LeftSideBar />
      <section className="flex h-full flex-1">
        <Outlet />
      </section>
      <Bottombar />
    </div>
  );
}

export default RootLayout;
