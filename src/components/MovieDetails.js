import { useEffect, useState } from "react";
import { useKey } from "../hooks/useKey";
import StarRating from "./StarRating";
import Loader from "./Loader";

export default function MovieDetails({
  watched,
  selectedId,
  onCloseMovie,
  onAddwatchedmovie,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handelAddWatchedMovie() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
    };

    onAddwatchedmovie(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      async function getMoviedetails() {
        setIsLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&i=${selectedId}`
        );

        const data = await res.json();
        setMovie(data);
        setIsLoading(false);
      }
      getMoviedetails();
    },
    [selectedId]
  );

  useEffect(
    function () {
      if (!title) return;
      document.title = `Filmy | ${title}`;

      return function () {
        document.title = "Filmy";
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${movie} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    onSetRating={setUserRating}
                    maxRating={10}
                    size={24}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handelAddWatchedMovie}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
