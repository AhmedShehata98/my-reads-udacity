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
    setSearch(value);
  };

  const handlechangeShelf = (book, shelf) => {
    const newBook = { ...book, shelf };
    update(book, shelf).then(() => {
      setBooksList((currentBooks) => [...currentBooks, newBook]);
    });
    console.log(shelf);
  };

  useEffect(() => {
    if (search !== "") {
      apiSearch(search, 10)
        .then((res) => {
          setIsPending(true);
          setisError({
            state: false,
            message: "",
          });
          if (Array.isArray(res)) {
            setSearchResultList(res);
          }
        })
        .catch((error) =>
          setisError({
            state: true,
            message: error?.message,
          })
        )
        .finally(() => setIsPending(false));
    } else {
      setSearchResultList([]);
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
        {!isPending && (
          <ul className="shuffles-list">
            <ShuffleItem
              onShelf={handlechangeShelf}
              title="search result"
              shuffleDataList={searchResultList}
            />
          </ul>
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
