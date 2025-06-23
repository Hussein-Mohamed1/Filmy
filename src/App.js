import { useState } from "react";
import { useMovies } from "./hooks/useMovies";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import MovieDetails from "./components/MovieDetails";
import Loader from "./components/Loader";
import WatchedList from "./components/WatchedList";
import NavBar from "./components/NavBar";
import WatchedSummary from "./components/WatchedSummary";
import MovieList from "./components/MovieList";
import Box from "./components/Box";
import NumResults from "./components/NumResults";
import Main from "./components/Main";
import Search from "./components/Search";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, isLoading, error } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([]);

  function handelSelectedId(id) {
    setSelectedId((selectedId) => (selectedId === id ? null : id));
  }

  function handelCloseMovie() {
    setSelectedId(null);
  }

  function addWatchedMovie(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function deleteWatchedMovie(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList
              onSelectedId={handelSelectedId}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              movies={movies}
            />
          )}
          {error && <Error message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              watched={watched}
              onAddwatchedmovie={addWatchedMovie}
              onCloseMovie={handelCloseMovie}
              selectedId={selectedId}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                onDeleteWatchedMovie={deleteWatchedMovie}
                watched={watched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Error({ message }) {
  return (
    <p className="error">
      <span>⛔️</span>
      {message}
    </p>
  );
}
