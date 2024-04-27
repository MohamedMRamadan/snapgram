import Loader from "@/components/shared/Loader";
import PostStats from "@/components/shared/PostStats";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import {
  useDeletePost,
  useGetPostById,
} from "@/lib/react-query/queriesAndMutation";
import { multiFormatDateString } from "@/lib/utils";
import { Link, useParams } from "react-router-dom";

const defaultDestruction = {
  creator: { $id: "", imageUrl: "", name: "" },
  location: "",
  $createdAt: "",
  imageUrl: "",
  imageId: "",
  caption: "",
  tags: "",
};

const PostDetails = () => {
  const { id = "" } = useParams();
  const { data: post, isLoading } = useGetPostById(id || "");
  const { mutateAsync: deletePost } = useDeletePost();
  const {
    creator: { $id: creatorId, imageUrl: creatorImg, name: creatorName },
    location,
    $createdAt,
    imageUrl,
    imageId,
    caption,
    tags,
  } = post || defaultDestruction;

  const {
    user: { id: userId },
  } = useUserContext();

  const isUserPost = userId === creatorId;

  const handleDeletePost = async () => {
    await deletePost({ postId: id, imageId });
  };

  return (
    <div className="post_details-container">
      {isLoading && <Loader />}
      {!isLoading && post && (
        <div className="post_details-card">
          <img src={imageUrl} alt="post" className="post_details-img" />
          <div className="post_details-info">
            <div className="flex-between w-full">
              <Link
                to={`/profile/${creatorId}`}
                className="flex items-center gap-3"
              >
                <img
                  src={creatorImg || "/assets/icons/profile-placeholder.svg"}
                  alt="creator img"
                  className="w-9 rounded-full lg:w-12"
                />
                <div>
                  <p className="base-medium lg:body-bold text-light-1">
                    {creatorName}
                  </p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {multiFormatDateString($createdAt)}
                    </p>
                    <span> • </span>
                    <p className="subtle-semibold lg:small-regular">
                      {location}
                    </p>
                  </div>
                </div>
              </Link>
              {isUserPost && (
                <div className="flex-center gap-4">
                  <Link to={`/update-post/${id}`}>
                    <img
                      src={`/assets/icons/edit.svg`}
                      alt="edit post"
                      width={24}
                    />
                  </Link>
                  <Button variant={"ghost"} className="post_details-delete_btn">
                    <img
                      src="/assets/icons/delete.svg"
                      alt="delete post"
                      width={24}
                      onClick={handleDeletePost}
                    />
                  </Button>
                </div>
              )}
            </div>
            <hr className="shad w-full border border-dark-4/80  " />
            <div className="small-medium lg:base-regular flex flex-1 flex-col">
              <p>{caption}</p>
              <ul className="mt-2 flex gap-1">
                {tags.map((tag: string, id: number) => (
                  <li className="text-light-3" key={id}>
                    #{tag}
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-full">
              <PostStats post={post} userId={userId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
