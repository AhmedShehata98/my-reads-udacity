import { nanoid } from "nanoid";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { update } from "../../BooksAPI";
import ShuffleItem from "../../Components/ShuffleItem/ShuffleItem";
import "./home.css";

const Home = ({ booksList, setBooksList, isPending, error }) => {
  const [readBooks, setReadBooks] = useState([]);
  const [wantToreadBooks, setWantToReadBooks] = useState([]);
  const [currentlyReadingBooks, setCurrentlyReadingBooks] = useState([]);
  // const readBooks = useRef([]);
  // const wantToreadBooks = useRef([]);
  // const currentlyReadingBooks = useRef([]);

  const handleBooksShelfList = (booksList) => {
    if (Array.isArray(booksList)) {
      const uniqueShelf = new Set(booksList.map((book) => book.shelf));
      const shelf = Array.from(uniqueShelf.values());
      const booksShelfList = {};
      shelf.forEach((shelf) =>
        Object.assign(booksShelfList, {
          [shelf || "others"]:
            booksList.filter((book) => book.shelf === shelf) !== undefined
              ? booksList.filter((book) => book.shelf === shelf)
              : [],
        })
      );
      return booksShelfList;
    } else {
      console.error(
        "handleBooksShelfList => function is expected array of book as a parameter but getting " +
          typeof booksList
      );
    }
  };
  const setBooksShelf = (booksList, shelf) => {
    if (Boolean(booksList) && booksList?.length > 0) {
      //
      setCurrentlyReadingBooks(shelf?.currentlyReading);
      setReadBooks(shelf?.read);
      setWantToReadBooks(shelf?.wantToRead);
    }
  };
  const onShelf = (bookData, shelf) => {
    update(bookData, shelf).then(() => {
      const shelfList = handleBooksShelfList(booksList);
      setBooksShelf(booksList, shelfList);

      setBooksList((currentdata) => [
        ...currentdata.filter((book) => book.id !== bookData.id),
        ...currentdata
          .filter((book) => book.id === bookData.id)
          .map((book) => ({ ...book, shelf: shelf })),
      ]);
      console.log("on shelf");
    });
  };

  useEffect(() => {
    if (!isPending && booksList?.length > 0) {
      const shelf = handleBooksShelfList(booksList);
      console.log(shelf);
      if (Boolean(shelf)) {
        console.log(" shelf useEffect");
        setBooksShelf(booksList, shelf);
      }
    }
  }, [booksList, isPending]);

  return (
    <main className="home-main">
      <section className="home-container">
        {isPending && (
          <h3 style={{ marginInline: "auto", paddingBlock: "5rem" }}>
            loading ...
          </h3>
        )}
        {!isPending && error === "" && (
          <>
            <ul className="shuffles-list">
              <ShuffleItem
                key={nanoid(6)}
                title="Currently Reading"
                shuffleDataList={currentlyReadingBooks}
                onShelf={onShelf}
              />
              <ShuffleItem
                key={nanoid(6)}
                title="read"
                shuffleDataList={readBooks}
                onShelf={onShelf}
              />
              <ShuffleItem
                key={nanoid(6)}
                title="want to read"
                shuffleDataList={wantToreadBooks}
                onShelf={onShelf}
              />
            </ul>
            <div className="search-btn">
              <Link to={"search"}></Link>
            </div>
          </>
        )}
        {error && <b>{error}</b>}
      </section>
    </main>
  );
};

Home.propTypes = {
  booksList: PropTypes.array.isRequired,
  setBooksList: PropTypes.func.isRequired,
};

export default Home;
