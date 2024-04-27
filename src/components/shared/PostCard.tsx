import { useUserContext } from "@/context/AuthContext";
import { multiFormatDateString } from "@/lib/utils";
import { Models } from "appwrite";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

const PostCard = ({ post }: { post: Models.Document }) => {
  const {
    creator: { $id: creatorId, name: creatorName },
    caption,
    $createdAt,
    location,
    $id: postId,
    tags,
    imageUrl,
  } = post;
  const {
    user: { id: userId },
  } = useUserContext();

  const isUserPost = userId === creatorId;
  return (
    <li className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${creatorId}`}>
            <img
              src={
                post.creator.imageUrl || "/assets/icons/profile-placeholder.svg"
              }
              alt="creator img"
              className="w-12 rounded-full lg:h-12"
            />
          </Link>
          <div>
            <p className="base-medium lg:body-bold text-light-1">
              {creatorName}
            </p>
            <div className="flex-center gap-2 text-light-3">
              <p className="subtle-semibold lg:small-regular">
                {multiFormatDateString($createdAt)}
              </p>
              <span> • </span>
              <p className="subtle-semibold lg:small-regular">{location}</p>
            </div>
          </div>
        </div>
        {isUserPost && (
          <Link to={`/update-post/${postId}`}>
            <img src={`/assets/icons/edit.svg`} alt="edit post" width={20} />
          </Link>
        )}
      </div>
      <Link to={`/posts/${postId}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{caption}</p>
          <ul className="mt-2 flex gap-1">
            {tags.map((tag: string, id: number) => (
              <li className="text-light-3" key={id}>
                #{tag}
              </li>
            ))}
          </ul>
        </div>
        <img
          src={imageUrl || "/assets/icons/profile-placeholder.svg"}
          alt="postimg"
          className="post-card_img"
        />
      </Link>
      <PostStats post={post} userId={userId} />
    </li>
  );
};

export default PostCard;
