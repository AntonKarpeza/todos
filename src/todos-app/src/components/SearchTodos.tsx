import React, { useState, useEffect } from 'react';
import { TextField, LinearProgress } from '@mui/material';

interface SearchTodoProps {
  onSearch: (searchText: string) => void;
}

const SearchTodo: React.FC<SearchTodoProps> = ({ onSearch }) => {
  const [searchText, setSearchText] = useState<string>('');
  const [debouncedSearchText, setDebouncedSearchText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchText(searchText);
      setIsTyping(false);
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  useEffect(() => {
    onSearch(debouncedSearchText);
  }, [debouncedSearchText, onSearch]);

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
    setIsTyping(true);
  };

  return (
    <>
      <TextField
        label="Search TODO"
        value={searchText}
        onChange={handleSearchInputChange}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      {isTyping && <LinearProgress />}
    </>
  );
};

export default SearchTodo;
