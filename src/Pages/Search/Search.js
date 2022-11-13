import { useEffect, useTransition, useState, useRef } from "react";
import PropTypes, { object } from "prop-types";
import ShuffleItem from "../../Components/ShuffleItem/ShuffleItem";
import { search as apiSearch, update } from "../../BooksAPI";
import { Link } from "react-router-dom";
import "./search.css";

const Search = ({ booksList, setBooksList, choosedBooksRef }) => {
  const [isError, setisError] = useState({
    state: false,
    message: "",
  });
  const [query, setQuery] = useState("");
  const [searchBooksList, setSearchBooksList] = useState([]);
  const [isTransition, startTransition] = useTransition();
  const errorCases = {
    API_ERROR_EMPTY_QUERY: "api-empty-query",
    EMPTY_SEARCH_INPUT: "empty-search-input",
    NETWORK_ERROR: "network-error",
  };
  const handleSearchQuery = (ev) => {
    const value = ev.target.value;
    setQuery(value);
  };

  const handleSearchResponses = (response) => {
    if (Array.isArray(response) && response?.length >= 1) {
      setisError({
        state: false,
        message: "",
      });
      handleSuccessSearch(response);
    }
    if (response?.error) {
      handleEmptyQuery(response);
    }
  };
  function handleSuccessSearch(respone = []) {
    const newResponse = [];
    startTransition(() => {
      const oldBooks = findAllOldBooks(booksList, respone);
      const newBooks = responseWithoutOldBooks(oldBooks, respone);

      newResponse.push(...oldBooks, ...newBooks);
    });
    setSearchBooksList(newResponse);
  }
  function findAllOldBooks(booksList = [], respone = []) {
    const responeID = respone.map((book) => book.id);
    return booksList.filter((book) => responeID.indexOf(book.id) !== -1);
  }
  function responseWithoutOldBooks(oldBooks = [], respone = []) {
    let oldBooksID = oldBooks.map((oldBook) => oldBook.id);
    return respone.filter((res) => oldBooksID.indexOf(res.id) === -1);
  }
  function handleEmptyQuery() {
    setisError({
      state: errorCases.API_ERROR_EMPTY_QUERY,
      message: "there is no result equal to your search.",
    });
  }
  const handleSearchErrors = (error) => {
    setisError({
      state: errorCases.NETWORK_ERROR,
      message: error?.message,
    });
  };

  const handlechangeShelf = (book, shelf) => {
    const shelfedBook = { ...book, shelf };
    update(book, shelf).then((response) => {
      if (booksList.find((oldBook) => oldBook.id === book.id) === undefined) {
        setBooksList((currentBooks) => [...currentBooks, shelfedBook]);
        setSearchBooksList((currentBooks) => [
          shelfedBook,
          ...currentBooks.filter((cBook) => cBook.id !== book.id),
        ]);
      } else {
        setBooksList((currentBooks) =>
          updateCurrentBookShelf(currentBooks, shelfedBook)
        );
        setSearchBooksList((currentBooks) =>
          updateCurrentBookShelf(currentBooks, shelfedBook)
        );
      }
    });
  };

  function updateCurrentBookShelf(currentBooks = [], shelfedBook) {
    const cloneCurrentBooks = JSON.stringify(currentBooks);
    const filteredBooks = JSON.parse(cloneCurrentBooks).filter(
      (currBook) => currBook.id !== shelfedBook.id
    );
    const newBooksList = [shelfedBook, ...filteredBooks];
    return newBooksList;
  }

  useEffect(() => {
    let timeout;
    if (query !== "") {
      timeout = setTimeout(() => {
        apiSearch(query, 5)
          .then((respone) => handleSearchResponses(respone))
          .catch((error) => handleSearchErrors(error));
      }, 250);
    } else {
      setSearchBooksList([]);
      setisError({
        state: errorCases.EMPTY_SEARCH_INPUT,
        message: "Write above to search for what you want",
      });
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  return (
    <main className="search-main">
      <div className="search-wrapper">
        <span className="back-btn-wrapper">
          <Link to={"/"} className={"back-btn"}></Link>
        </span>
        <input
          type={"search"}
          placeholder={"search in books ..."}
          onChange={(ev) => handleSearchQuery(ev)}
          value={query}
        />
        {isTransition && (
          <span className="spinner-wrapper">
            <span className="load-spinner"></span>
          </span>
        )}
      </div>
      <section className="home-container">
        {isError?.state === false && query.length > 0 && (
          <ul className="shuffles-list">
            <ShuffleItem
              onShelf={handlechangeShelf}
              title="search result"
              shuffleDataList={searchBooksList}
            />
          </ul>
        )}
        {isError?.state === errorCases?.EMPTY_SEARCH_INPUT && (
          <h3 style={{ marginInline: "auto", paddingBlock: "5rem" }}>
            {isError?.message}
          </h3>
        )}
        {isError?.state === errorCases?.API_ERROR_EMPTY_QUERY && (
          <h3 style={{ marginInline: "auto", paddingBlock: "5rem" }}>
            {isError?.message}
          </h3>
        )}
        {isError?.state === errorCases?.NETWORK_ERROR && (
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
  choosedBooksRef: PropTypes.array.isRequired,
};
export default Search;
