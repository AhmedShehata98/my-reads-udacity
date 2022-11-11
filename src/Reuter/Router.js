import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { getAll } from "../BooksAPI";
import Home from "../Pages/Home/Home";
import Search from "../Pages/Search/Search";

function Router() {
  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState("");
  const [booksList, setBooksList] = useState([]);

  useEffect(() => {
    if (booksList.length <= 0) {
      getAll()
        .then((res) => {
          setBooksList(res);
          setError("");
          setIsPending(false);
        })
        .catch((error) => {
          setBooksList([]);
          setError(error?.message);
          setIsPending(false);
        })
        .finally(() => setIsPending(false));
    }
  }, [setBooksList]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/">
          <Route
            index
            element={
              <Home
                booksList={booksList}
                setBooksList={setBooksList}
                isPending={isPending}
                error={error}
              />
            }
          />
          <Route
            path="search"
            element={
              <Search booksList={booksList} setBooksList={setBooksList} />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
