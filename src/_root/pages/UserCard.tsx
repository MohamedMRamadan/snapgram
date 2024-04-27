import { Button } from "@/components/ui/button";
import { Models } from "appwrite";
import { Link } from "react-router-dom";

type UserCardProps = {
  user: Models.Document;
};
const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link
      to={`profile/${user.$id}`}
      className="flex-center flex-col gap-4 rounded-2xl border border-dark-4 px-5 py-8"
    >
      <img
        src={user.imageUrl}
        alt={`user_${user.$id}`}
        className="w-14 rounded-full"
      />
      <div className="flex flex-col gap-1 text-center">
        <p className="line-clamp-1">{user.name}</p>
        <p className="line-clamp-1 text-sm text-light-3">@{user.username}</p>
      </div>
      <Button size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;
