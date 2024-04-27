import Loader from "@/components/shared/Loader";
import PostCard from "@/components/shared/PostCard";
import {
  useGetRecentPosts,
  useGetUsers,
} from "@/lib/react-query/queriesAndMutation";
import { Models } from "appwrite";
import UserCard from "./UserCard";

function Home() {
  const { data: recentPosts, isLoading: isPostsLoading } = useGetRecentPosts();
  const { data: users, isLoading: isLoadingUsers } = useGetUsers(10);

  if (isPostsLoading || isLoadingUsers) return <Loader option="full" />;

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold w-full text-left">Home Feed</h2>
          {isPostsLoading && !recentPosts ? (
            <Loader />
          ) : (
            <ul className="flex w-full flex-col gap-9">
              {recentPosts?.documents.map((post: Models.Document) => (
                <PostCard post={post} key={post.$id} />
              ))}
            </ul>
          )}
        </div>
      </div>
      <div className="home-creators">
        <h3 className="h3-bold text-light-1">Top Creators</h3>
        <ul className="grid gap-6 2xl:grid-cols-2">
          {users?.documents.map((user) => (
            <li key={user.$id}>
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Home;
