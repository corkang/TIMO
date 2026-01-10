import React, { useState, useEffect, useCallback } from 'react';
import { makeStyles, TextField, InputAdornment } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';

const useStyles = makeStyles(() => ({
  searchField: {
    width: 300,
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      backgroundColor: '#fafafa',
      height: 48,
      '& fieldset': {
        borderColor: '#ccc',
      },
      '&:hover fieldset': {
        borderColor: '#1b8986',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#1b8986',
      },
    },
    '& .MuiOutlinedInput-input': {
      fontSize: 18,
      fontFamily: 'Lato, Noto Sans KR, sans-serif',
      '&::placeholder': {
        color: '#ccc',
        opacity: 1,
      },
    },
  },
  searchIcon: {
    color: '#ccc',
    fontSize: 26,
  },
}));

export default function SearchBar({ onSearch, placeholder = '강의명/교수명/과목코드' }) {
  const classes = useStyles();
  const [value, setValue] = useState('');

  // Debounce search
  const debounce = useCallback((func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  }, []);

  const debouncedSearch = useCallback(
    debounce((query) => {
      onSearch(query);
    }, 300),
    [onSearch, debounce],
  );

  useEffect(() => {
    debouncedSearch(value);
  }, [value, debouncedSearch]);

  return (
    <TextField
      variant="outlined"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className={classes.searchField}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon className={classes.searchIcon} />
          </InputAdornment>
        ),
      }}
    />
  );
}
