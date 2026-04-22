import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery as setSearchQueryAction } from '../store/slices/searchSlice';
import { SearchContext } from './searchContext';

export function SearchProvider({ children }) {
  const dispatch = useDispatch();
  const searchQuery = useSelector((state) => state.search.searchQuery);

  const setSearchQuery = (query) => {
    dispatch(setSearchQueryAction(query));
  };

  return (
    <SearchContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
}
