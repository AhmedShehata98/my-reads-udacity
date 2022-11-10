import { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import ShuffleItem from "../../Components/ShuffleItem/ShuffleItem";
import { search as apiSearch, update } from "../../BooksAPI";
import { Link } from "react-router-dom";
import "./search.css";

const Search = ({ booksList, setBooksList }) => {
  const [isPending, setIsPending] = useState(false);
  const [isError, setisError] = useState({
    state: false,
    message: "",
  });
  const [searchResultList, setSearchResultList] = useState([]);
  const [search, setSearch] = useState("");

  const handleSearch = (ev) => {
    const value = ev.target.value;
    setSearch(value.trim());
  };

  const handlechangeShelf = (myBook, shelf) => {
    const newBook = { ...myBook, shelf };
    update(myBook, shelf).then(() => {
      setBooksList((currentBooks) => [...currentBooks, newBook]);
      setSearchResultList((prevBook) => [
        ...prevBook.filter((books) => books.id !== myBook.id),
        { ...myBook, shelf },
      ]);
    });
  };

  const handleEmptyQuery = (response) => {
    if (response?.error) {
      setBooksList([]);
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
    setIsPending(false);
  };
  const handleSearchResults = (response) => {
    if (Array.isArray(response) && response?.error === undefined) {
      setSearchResultList(response);
      setIsPending(false);
    }
  };
  const handleResponseError = (error) => {
    setisError({
      state: true,
      message: error?.message,
    });
    setIsPending(false);
  };
  const handleSearchResponse = (response) => {
    setIsPending(true);
    handleEmptyQuery(response);
    handleSearchResults(response);
  };

  useEffect(() => {
    if (Boolean(search)) {
      apiSearch(search, 12)
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
      </div>
      <section className="home-container">
        {!isPending && !isError?.state && search.length > 0 && (
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
        {isPending && (
          <h3 style={{ marginInline: "auto", paddingBlock: "5rem" }}>
            loading ...
          </h3>
        )}
        {!isPending && isError?.state && (
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
