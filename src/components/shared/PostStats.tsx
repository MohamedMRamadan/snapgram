import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queriesAndMutation";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React, { useEffect, useState } from "react";
import Loader from "./Loader";
import { useLocation } from "react-router-dom";

type postStatsProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: postStatsProps) => {
  const { $id: postId, likes: postLikes } = post;
  const likeList = postLikes.map((user: Models.Document) => user.$id);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingSaved } =
    useDeleteSavedPost();
  const { data: currentUser } = useGetCurrentUser();

  const [likes, setLikes] = useState(likeList);
  const [isSaved, setIsSaved] = useState(false);
  const [isLikeClicked, setIsLikeClicked] = useState(false);
  const { pathname } = useLocation();

  const savePostRecord = currentUser?.save.find(
    (record: Models.Document) => record.post.$id === postId,
  );
  useEffect(() => {
    setIsSaved(!!savePostRecord);
  }, [savePostRecord]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLikeClicked(false), 350);

    return () => {
      clearInterval(timer);
    };
  }, [likeList]);

  const handleLikePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setIsLikeClicked(true);
    let newLikes: string[] = [...likes];
    const isPostLiked = newLikes.includes(userId);
    if (isPostLiked) {
      newLikes = newLikes.filter((id) => id !== userId);
    } else {
      newLikes.push(userId);
    }
    setLikes(newLikes);
    likePost({ postId, likes: newLikes });
  };
  const handleSavePost = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    if (savePostRecord) {
      setIsSaved(false);
      deleteSavedPost(savePostRecord.$id);
    } else {
      setIsSaved(true);
      savePost({ postId, userId });
    }
  };
  const isFullWidth = pathname === `/profile/${userId}`;

  return (
    <div
      className={`z-20 flex items-center justify-between ${isFullWidth ? "w-full" : ""}`}
    >
      <div className="mr-5 flex items-center gap-1.5">
        <img
          src={`/assets/icons/${checkIsLiked(likes, userId) ? "liked" : "like"}.svg`}
          alt="like"
          width={20}
          className={`${isLikeClicked ? "img-scale" : ""} cursor-pointer`}
          onClick={handleLikePost}
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      {isSavingPost || isDeletingSaved ? (
        <Loader />
      ) : (
        <div className="flex gap-2">
          <img
            src={`/assets/icons/${isSaved ? "saved" : "save"}.svg`}
            alt="save"
            width={20}
            className="cursor-pointer"
            onClick={handleSavePost}
          />
        </div>
      )}
    </div>
  );
};

export default PostStats;
