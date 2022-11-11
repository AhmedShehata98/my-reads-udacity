import React from "react";
import "./shuffleItem.css";
import PropTypes from "prop-types";
import { nanoid } from "nanoid";

const ShuffleItem = ({ shuffleDataList, title, onShelf }) => {
  return (
    <div className="shuffle-item">
      <span className="title">
        <h3>{title}</h3>
        <hr style={{ width: "100%" }} />
      </span>
      <ul className="shuffle-items-list">
        {shuffleDataList?.length > 0 ? (
          shuffleDataList.map((book) => {
            return (
              <li className="book-item" key={nanoid(4)}>
                <figure className="image-wrapper">
                  <img
                    src={book?.imageLinks?.smallThumbnail}
                    alt={`book-image #-${book?.id}`}
                    title={`book-image`}
                  />
                  <div
                    className="book-shelf-changer"
                    defaultChecked={book?.shelf}
                  >
                    <select
                      name="shuffle-categories"
                      title={"shuffle-categories"}
                      onChange={(ev) => onShelf(book, ev.target.value)}
                      value={book.shelf ? book.shelf : "None"}
                    >
                      <option disabled={true}>add to </option>
                      <option value={"currentlyReading"}>
                        currently Reading
                      </option>
                      <option value={"read"}>read</option>
                      <option value={"wantToRead"}>want To Read</option>
                      <option value={"None"}>None</option>
                    </select>
                  </div>
                </figure>
                <figcaption className="book-item-content">
                  <p className="book-title">{book.title}</p>
                  <span className="authers-list">
                    {book.authors?.map((auther) => (
                      <small key={auther} className="book-auther">
                        {auther}
                      </small>
                    ))}
                  </span>
                </figcaption>
              </li>
            );
          })
        ) : (
          <p> sorry , but no data in this section to display</p>
        )}
      </ul>
    </div>
  );
};
ShuffleItem.propTypes = {
  shuffleDataList: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  onShelf: PropTypes.func.isRequired,
};

export default ShuffleItem;
