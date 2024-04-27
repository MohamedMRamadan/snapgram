import GridPostsList from "@/components/shared/GridPostsList";
import Loader from "@/components/shared/Loader";
import SearchResults from "@/components/shared/SearchResults";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDepuncing";
import {
  useGetPosts,
  useSearchPosts,
} from "@/lib/react-query/queriesAndMutation";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Explore = () => {
  const [searchValue, setSearchValue] = useState("");
  const depouncedValue = useDebounce(searchValue, 500);
  const { ref, inView } = useInView();

  const {
    data: posts,
    hasNextPage,
    fetchNextPage,
    isLoading: isLoadingPosts,
  } = useGetPosts();

  const { data: searchedPosts, isLoading: isLoadingSearchedPosts } =
    useSearchPosts(depouncedValue);

  const shouldShowSearchResult = !!searchValue;
  const shouldShowPosts =
    !shouldShowSearchResult &&
    posts?.pages.every((item) => item?.documents.length === 0);

  useEffect(() => {
    console.log(`inview => ${inView}`);
    if (inView && !searchValue) fetchNextPage();
  }, [searchValue, inView, fetchNextPage]);

  if (!posts) return <Loader option="full" />;

  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3-bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex w-full gap-1 rounded-lg bg-dark-4 px-4">
          <img src="/assets/icons/search.svg" alt="search" width={24} />
          <Input
            type="text"
            name=""
            id=""
            placeholder="Search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>
      <div className="flex-between mb-7 mt-16 w-full max-w-5xl">
        <div className="body-bold md:h3-bold">Popular Today</div>
        <div className="flex-center cursor-pointer gap-3 rounded-xl bg-dark-3 px-4 py-2">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img src="/assets/icons/filter.svg" alt="filter" width={20} />
        </div>
      </div>
      <div className="flex w-full max-w-5xl flex-wrap gap-9">
        {shouldShowSearchResult && searchedPosts ? (
          <SearchResults
            isLoadingSearchedPosts={isLoadingSearchedPosts}
            searchedPosts={searchedPosts}
          />
        ) : shouldShowPosts ? (
          <p className="mt-10 w-full text-center text-light-4">End of Posts</p>
        ) : (
          posts.pages.map((item, index) => (
            <GridPostsList
              key={`post-${index}`}
              posts={item?.documents ?? []}
            />
          ))
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default Explore;
