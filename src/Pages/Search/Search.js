import { useEffect, useTransition, useState, useRef } from "react";
import PropTypes from "prop-types";
import ShuffleItem from "../../Components/ShuffleItem/ShuffleItem";
import { search as apiSearch, update } from "../../BooksAPI";
import { Link } from "react-router-dom";
import "./search.css";

const Search = ({ booksList, setBooksList }) => {
  const [isError, setisError] = useState({
    state: false,
    message: "",
  });
  const [search, setSearch] = useState("");
  const [isTransition, startTransition] = useTransition();
  const [searchResultList, setSearchResultList] = useState([]);
  const [resultItemsCount, setResultItemsCount] = useState("8");
  const handleSearch = (ev) => {
    const value = ev.target.value;
    setSearch(value.trim());
  };

  const handleChangeCount = (ev) => {
    const value = ev.target.value;
    setResultItemsCount(value.toString());
  };
  const handlechangeShelf = (myBook, shelf) => {
    const newBook = { ...myBook, shelf };
    update(myBook, shelf).then(() => {
      startTransition(() => {
        setSearchResultList((currentData) => [
          ...currentData
            .filter((book) => book.id === myBook.id)
            .map((book) => ({ ...book, shelf })),
          ...currentData.filter((book) => book.id !== myBook.id),
        ]);

        setBooksList((currentList) => [...currentList, newBook]);
      });
    });
  };

  const handleEmptyQuery = (response) => {
    if (response?.error) {
      setSearchResultList([]);
      setisError({
        state: true,
        message: "Oops ,There are no results identical to this research .",
      });
    } else {
      setisError({
        state: false,
        message: "",
      });
    }
  };
  const handleSearchResults = (response) => {
    if (Array.isArray(response) && response?.error === undefined) {
      setSearchResultList(response);
    }
  };
  const handleResponseError = (error) => {
    setisError({
      state: true,
      message: error?.message,
    });
  };
  const handleSearchResponse = (response) => {
    handleEmptyQuery(response);
    handleSearchResults(response);
  };

  useEffect(() => {
    if (Boolean(search)) {
      apiSearch(search, resultItemsCount)
        .then((response) => handleSearchResponse(response))
        .catch((error) => handleResponseError(error));
    } else {
      setSearchResultList([]);
      setisError({
        state: false,
        message: "",
      });
    }
  }, [search]);

  return (
    <main className="search-main">
      <div className="search-wrapper">
        <span className="back-btn-wrapper">
          <Link to={"/"} className={"back-btn"}></Link>
        </span>
        <input
          type={"search"}
          placeholder={"search in books ..."}
          onChange={(ev) => handleSearch(ev)}
          value={search}
        />
        {isTransition && (
          <span className="spinner-wrapper">
            <span className="load-spinner"></span>
          </span>
        )}
        <div className="items-count">
          <h4>result count :</h4>
          <select
            defaultValue={resultItemsCount.toString()}
            title="count-of-search-items"
            onChange={(ev) => handleChangeCount(ev)}
          >
            <option value={"3"}>3 - items</option>
            <option value={"6"}>6 - items</option>
            <option value={"8"}>8 - items</option>
            <option value={"12"}>12 - items</option>
            <option value={"18"}>18 - items</option>
            <option value={"25"}>25 - items</option>
          </select>
        </div>
      </div>
      <section className="home-container">
        {!isError?.state && search.length > 0 && (
          <ul className="shuffles-list">
            <ShuffleItem
              onShelf={handlechangeShelf}
              title="search result"
              shuffleDataList={searchResultList}
            />
          </ul>
        )}
        {search.length <= 0 && (
          <h3 style={{ marginInline: "auto", paddingBlock: "5rem" }}>
            Write above to search for what you want
          </h3>
        )}
        {!isTransition && isError?.state && (
          <h3 style={{ marginInline: "auto", paddingBlock: "5rem" }}>
            {isError?.message}
          </h3>
        )}
      </section>
    </main>
  );
};

Search.propTypes = {
  booksList: PropTypes.array.isRequired,
  setBooksList: PropTypes.func.isRequired,
};
export default Search;
