import { useParams } from "react-router-dom";
import NowPlayingList from "../components/Categories/NowPlayingList";
import PopularList from "../components/Categories/PopularList";
import TopRatedList from "../components/Categories/TopRatedList";
import UpcomingList from "../components/Categories/UpcomingList";
import GenreList from "../components/GenreList";

interface CategoryProp {
  genre: number;
  changeGenre: Function;
  changeDisplayList: Function;
  displayList: boolean;
}

const CategoryRoute: React.FC<CategoryProp> = ({
  changeGenre,
  genre,
  changeDisplayList,
  displayList
}) => {
  changeDisplayList(false);

  const { categoryName } = useParams();

  let categoryComponent = null;

  switch (categoryName) {
    case 'Popular':
      categoryComponent = <PopularList
        genre={genre}
        displayHomepage={displayList} />;
      break;
    case 'Upcoming':
      categoryComponent = <UpcomingList
        genre={genre}
        displayHomepage={displayList} />;
      break;
    case 'Now Playing':
      categoryComponent = <NowPlayingList
        genre={genre}
        displayHomepage={displayList} />;
      break;
    case 'Top Rated':
      categoryComponent = <TopRatedList
        genre={genre}
        displayHomepage={displayList} />;
      break;
  }

  return (
    <>
      <div className="bg-black dark:text-white flex flex-row">
        <div className="font-sans flex flex-col text-center sm:flex-row sm:text-left sm:justify-between py-4 px-6 bg-black shadow sm:items-baseline fixed z-5">
          <GenreList changeGenre={changeGenre} />
        </div>
        <div className="pl-60 pt-20">
          {categoryComponent}
        </div>
      </div>
    </>
  )
}

export default CategoryRoute;