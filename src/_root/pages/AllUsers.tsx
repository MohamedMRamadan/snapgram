import { useGetUsers } from "@/lib/react-query/queriesAndMutation";
import UserCard from "./UserCard";
import Loader from "@/components/shared/Loader";

const AllUsers = () => {
  const { data: users, isLoading } = useGetUsers();
  if (isLoading) return <Loader option="full" />;
  return (
    <div className="custom-scrollbar flex flex-1 flex-col items-center gap-24 overflow-auto px-5 py-9 md:p-14">
      <div className="flex w-full max-w-5xl flex-col gap-8">
        <h2 className="text-3xl font-semibold">All Users</h2>
        <ul className="grid gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {users?.documents.map((user) => (
            <li key={user.$id}>
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AllUsers;
