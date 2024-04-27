import PostForm from "@/components/forms/PostForm";
import Loader from "@/components/shared/Loader";
import { useGetPostById } from "@/lib/react-query/queriesAndMutation";
import { useParams } from "react-router-dom";

const UpdatePost = () => {
  const { id } = useParams();
  const { data: post, isPending: isLoading } = useGetPostById(id || "");

  if (isLoading)
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader />
      </div>
    );
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="flex-start w-full max-w-5xl gap-3">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="add-post"
          />
          <h2 className="h3-bold md:h2-bold">Update post</h2>{" "}
          {/* text-left w-full */}
        </div>
        <PostForm action="Update" post={post} />
      </div>
    </div>
  );
};

export default UpdatePost;
