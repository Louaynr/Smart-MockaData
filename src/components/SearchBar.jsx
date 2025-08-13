import React, { useState } from 'react';
import {
  Paper,
  InputBase,
  IconButton,
  Box,
  Typography,
  Chip,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon
} from '@mui/icons-material';

const SearchBar = ({ onSearch, searchType, onSearchTypeChange, placeholder = "Search..." }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const newHistory = [searchQuery, ...searchHistory.filter(item => item !== searchQuery)].slice(0, 5);
      setSearchHistory(newHistory);
      onSearch(searchQuery);
    }
  };

  const handleClear = () => {
    setSearchQuery('');
    onSearch('');
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleHistoryClick = (query) => {
    setSearchQuery(query);
    onSearch(query);
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Paper
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          maxWidth: 600,
          mx: 'auto'
        }}
      >
        <FormControl size="small" sx={{ minWidth: 120, mx: 1 }}>
          <Select
            value={searchType}
            onChange={(e) => onSearchTypeChange(e.target.value)}
            displayEmpty
            sx={{ '& .MuiSelect-select': { py: 1 } }}
          >
            <MenuItem value="basic">Basic Search</MenuItem>
            <MenuItem value="advanced">Advanced Search</MenuItem>
            <MenuItem value="query">Query Search</MenuItem>
          </Select>
        </FormControl>
        
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        
        <IconButton 
          sx={{ p: '10px' }} 
          onClick={handleSearch}
          disabled={!searchQuery.trim()}
        >
          <SearchIcon />
        </IconButton>
        
        {searchQuery && (
          <IconButton 
            sx={{ p: '10px' }} 
            onClick={handleClear}
          >
            <ClearIcon />
          </IconButton>
        )}
      </Paper>

      {searchHistory.length > 0 && (
        <Box sx={{ mt: 1, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
            Recent searches:
          </Typography>
          {searchHistory.map((query, index) => (
            <Chip
              key={index}
              label={query}
              size="small"
              onClick={() => handleHistoryClick(query)}
              sx={{ mr: 0.5, mb: 0.5, cursor: 'pointer' }}
            />
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchBar; 