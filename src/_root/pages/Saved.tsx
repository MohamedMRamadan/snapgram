import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutation";
import Loader from "@/components/shared/Loader";
import GridPostsList from "@/components/shared/GridPostsList";
import { Models } from "appwrite";

const Saved = () => {
  const { data: user, isLoading } = useGetCurrentUser();
  if (isLoading || !user) return <Loader option="full" />;
  const savedPosts = user.save.map((savedPost: Models.Document) => ({
    ...savedPost.post,
    creator: {
      imageUrl: user.imageUrl,
    },
  }));
  return (
    <div className="custom-scrollbar flex flex-1 flex-col items-center gap-24 overflow-auto px-5 py-9 md:p-14">
      <div className="flex w-full max-w-5xl flex-col gap-8">
        <div className="flex gap-3">
          <img
            src="/assets/icons/save.svg"
            alt="save-icon"
            className="invert-white w-9"
          />
          <h2 className="text-3xl font-bold">Saved Posts</h2>
        </div>
        <GridPostsList showStats={false} posts={savedPosts} />
      </div>
    </div>
  );
};

export default Saved;
