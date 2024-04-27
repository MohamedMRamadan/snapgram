import PostForm from "@/components/forms/PostForm";

const CreatePost = () => {
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
          <h2 className="h3-bold md:h2-bold">Create post</h2>{" "}
          {/* text-left w-full */}
        </div>
        <PostForm action="Create" />
      </div>
    </div>
  );
};

export default CreatePost;
