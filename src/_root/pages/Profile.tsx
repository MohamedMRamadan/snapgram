import GridPostsList from "@/components/shared/GridPostsList";
import Loader from "@/components/shared/Loader";
import { useGetUserById } from "@/lib/react-query/queriesAndMutation";
import { Link, NavLink, useLocation, useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const { data: user, isLoading } = useGetUserById(id || "");
  const { pathname } = useLocation();

  const showLikedPosts = pathname.includes("likedPosts");

  if (!user || isLoading) return <Loader option="full" />;

  return (
    <div className="custom-scrollbar flex flex-1 flex-col items-center gap-24 overflow-auto px-5 py-9 md:p-14">
      <div className="flex w-full max-w-5xl flex-col items-center justify-between gap-6 xl:flex-row xl:items-start ">
        <img
          src={user?.imageUrl}
          alt={`user-${user?.$id}`}
          className="w-36 rounded-full"
        />
        <div className="flex h-full flex-1 flex-col gap-10 text-center xl:text-left">
          <div className="pt-2">
            <p className="pb-1 text-2xl font-bold sm:text-4xl">{user?.name}</p>
            <p className="text-lg font-medium text-light-3">
              @{user?.username}
            </p>
          </div>
          <div className="flex flex-wrap gap-8">
            <p className="font-medium">
              <span className="pr-2 text-lg font-bold text-primary-500">6</span>
              <span>Posts</span>
            </p>
            <p className="font-medium">
              <span className="pr-2 text-lg font-bold text-primary-500">
                20
              </span>
              <span>Followers</span>
            </p>
            <p className="font-medium">
              <span className="pr-2 text-lg font-bold text-primary-500">
                20
              </span>
              <span>Following</span>
            </p>
          </div>
        </div>
        <Link
          to={`/update-profile/${id}`}
          className="mt-5 flex cursor-pointer gap-2 rounded-lg bg-dark-4 px-5 py-4 text-sm xl:mt-0"
        >
          <img src="/assets/icons/edit.svg" alt="edit-icon" width={20} />
          <span>Edit Profile</span>
        </Link>
      </div>
      <div className="w-full max-w-5xl">
        <div className="flex min-h-14 w-full overflow-hidden rounded-lg xl:w-96 ">
          <NavLink
            end
            to=""
            className={({ isActive }) =>
              `flex-center flex-1 gap-3 ${isActive ? "bg-dark-3" : "bg-dark-2"} `
            }
          >
            <img src="/assets/icons/posts.svg" alt="posts" width={20} />
            <span>Posts</span>
          </NavLink>
          <NavLink
            to={`likedPosts`}
            className={({ isActive }) =>
              `flex-center flex-1 gap-3 ${isActive ? "bg-dark-3" : "bg-dark-2"} `
            }
          >
            <img src="/assets/icons/like.svg" alt="posts" width={20} />
            <span>Liked Posts</span>
          </NavLink>
        </div>
      </div>
      {!showLikedPosts && (
        <GridPostsList showUser={false} posts={user?.posts} />
      )}
      {showLikedPosts && (
        <GridPostsList showStats={false} posts={user?.liked} />
      )}
    </div>
  );
};

export default Profile;
