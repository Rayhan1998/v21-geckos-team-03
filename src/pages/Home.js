import React, { useState } from 'react';
import { Stack, Heading, Spinner, Text, Button, Flex } from '@chakra-ui/core';
import {
  IMAGE_BASE_URL,
  POSTER_SIZE,
  SEARCH_BASE_URL,
  TRENDING_BASE_URL,
} from '../utils/config';

import useHomeFetch from '../hooks/useHomeFetch';

// import PropTypes from 'prop-types';
import SearchBar from '../components/SearchBar';
import NoImage from '../images/no_image.png';
import MovieCard from '../components/MovieCard';

/* 
  Route: "/"
  will contain search movie, movie results components
*/

const Home = (props) => {
  const [{ state, loading, error }, fetchMovies] = useHomeFetch();
  const [searchTerm, setSearchTerm] = useState('');

  const searchMovies = (search) => {
    const endpoint = search ? SEARCH_BASE_URL + search : TRENDING_BASE_URL;

    setSearchTerm(search);
    fetchMovies(endpoint);
  };

  const loadMoreMovies = () => {
    const searchEndPoint = `${SEARCH_BASE_URL}${searchTerm}&page=${
      state.currentPage + 1
    }`;

    const trendingEndpoint = `${TRENDING_BASE_URL}&page=${
      state.currentPage + 1
    }`;

    const endpoint = searchTerm ? searchEndPoint : trendingEndpoint;

    fetchMovies(endpoint);
  };

  if (error) return <Text>Something went wrong</Text>;

  return (
    <>
      {!searchTerm && (
        <Heading>Search for movies and add them to a watch list!</Heading>
      )}
      <SearchBar callback={searchMovies} />
      <Heading>{searchTerm ? 'Search Result' : 'Trending Movies'}</Heading>
      <Stack>
        {loading && <Spinner />}
        {state.movies.map((movie) => (
          <MovieCard
            key={movie.id}
            movieId={movie.id}
            movie={movie}
            image={
              movie.poster_path
                ? `${IMAGE_BASE_URL}${POSTER_SIZE}${movie.poster_path}`
                : NoImage
            }
          />
        ))}
      </Stack>
      <Flex align="center" justify="center">
        {state.currentPage < state.totalPages && !loading && (
          <Button type="submit" onClick={loadMoreMovies}>
            Load More
          </Button>
        )}
      </Flex>
    </>
  );
};

Home.propTypes = {};

export default Home;
