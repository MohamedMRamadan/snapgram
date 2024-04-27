import { Models } from "appwrite";
import Loader from "./Loader";
import GridPostsList from "./GridPostsList";

type SearchResultsProps = {
  isLoadingSearchedPosts: boolean;
  searchedPosts: {
    total: number;
    documents: Models.Document[];
  };
};

const SearchResults = ({
  isLoadingSearchedPosts,
  searchedPosts,
}: SearchResultsProps) => {
  console.log(searchedPosts);
  if (isLoadingSearchedPosts) return <Loader option="full" />;
  if (searchedPosts?.documents.length > 0)
    return <GridPostsList posts={searchedPosts.documents} />;
  return (
    <div className="mt-10 w-full text-center text-light-4">
      No Results Found
    </div>
  );
};

export default SearchResults;
