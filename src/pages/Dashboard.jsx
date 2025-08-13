import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Divider,
  IconButton
} from '@mui/material';
import {
  People as PeopleIcon,
  Book as BookIcon,
  Category as CategoryIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  AutoAwesome as AutoAwesomeIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import ApiService from '../services/api.service';
import BookForm from '../components/BookForm';
import CategoryForm from '../components/CategoryForm';
import ApiForm from '../components/ApiForm';
import SearchBar from '../components/SearchBar';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [users, setUsers] = useState([]);
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('basic');
  const [filteredData, setFilteredData] = useState([]);
  
  // Form states
  const [openBookForm, setOpenBookForm] = useState(false);
  const [openCategoryForm, setOpenCategoryForm] = useState(false);
  const [openApiForm, setOpenApiForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // POST API states
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [createType, setCreateType] = useState('');
  const [modelStructure, setModelStructure] = useState({});
  const [formData, setFormData] = useState({});
  const [generatingMock, setGeneratingMock] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch all data in parallel
      const [usersData, booksData, categoriesData, apisData] = await Promise.all([
        ApiService.getAllUsers(),
        ApiService.getAllBooks(),
        ApiService.getAllCategories(),
        ApiService.getAllApis()
      ]);
      
      setUsers(usersData.data);
      setBooks(booksData.data);
      setCategories(categoriesData.data);
      setApis(apisData.data);
      toast.success('Data loaded successfully!');
    } catch (err) {
      setError('Failed to load data. Please check your connection and try again.');
      toast.error('Failed to load data');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const getTabData = () => {
    switch (activeTab) {
      case 0:
        return { data: users, title: 'Users', icon: <PeopleIcon />, color: 'primary', type: 'user' };
      case 1:
        return { data: books, title: 'Books', icon: <BookIcon />, color: 'secondary', type: 'book' };
      case 2:
        return { data: categories, title: 'Categories', icon: <CategoryIcon />, color: 'success', type: 'category' };
      case 3:
        return { data: apis, title: 'API Endpoints', icon: <AutoAwesomeIcon />, color: 'info', type: 'api' };
      default:
        return { data: [], title: '', icon: null, color: 'default', type: '' };
    }
  };

  const handleCreateClick = async () => {
    const { type } = getTabData();
    setCreateType(type);
    
    try {
      // Get model structure from backend (this would be your actual API call)
      const structure = await getModelStructure(type);
      setModelStructure(structure);
      setFormData(generateEmptyForm(structure));
      setOpenCreateDialog(true);
    } catch (err) {
      toast.error('Failed to get model structure');
      console.error(err);
    }
  };

  const getModelStructure = async (type) => {
    // This is a mock structure - replace with actual API call to get model schema
    const mockStructures = {
      user: {
        username: { type: 'string', required: true, label: 'Username' },
        email: { type: 'email', required: true, label: 'Email' },
        password: { type: 'password', required: true, label: 'Password' },
        role: { type: 'select', required: false, label: 'Role', options: ['USER', 'ADMIN'] },
        isActive: { type: 'boolean', required: false, label: 'Active' }
      },
      book: {
        title: { type: 'string', required: true, label: 'Title' },
        author: { type: 'string', required: true, label: 'Author' },
        isbn: { type: 'string', required: false, label: 'ISBN' },
        description: { type: 'textarea', required: false, label: 'Description' },
        categoryId: { type: 'select', required: false, label: 'Category', options: categories.map(c => ({ value: c.id, label: c.name })) },
        published: { type: 'boolean', required: false, label: 'Published' }
      },
      category: {
        name: { type: 'string', required: true, label: 'Name' },
        description: { type: 'textarea', required: false, label: 'Description' },
        isActive: { type: 'boolean', required: false, label: 'Active' }
      }
    };
    
    return mockStructures[type] || {};
  };

  const generateEmptyForm = (structure) => {
    const empty = {};
    Object.keys(structure).forEach(key => {
      const field = structure[key];
      if (field.type === 'boolean') {
        empty[key] = false;
      } else if (field.type === 'select') {
        empty[key] = '';
      } else {
        empty[key] = '';
      }
    });
    return empty;
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const { type } = getTabData();
      let response;
      
      if (type === 'user') {
        response = await ApiService.createUser(formData);
        setUsers(prev => [...prev, response.data]);
      } else if (type === 'book') {
        // Handle category relationship for books
        const bookData = { ...formData };
        if (bookData.categoryId) {
          bookData.category = { id: bookData.categoryId };
          delete bookData.categoryId;
        }
        response = await ApiService.createBook(bookData);
        setBooks(prev => [...prev, response.data]);
      } else if (type === 'category') {
        response = await ApiService.createCategory(formData);
        setCategories(prev => [...prev, response.data]);
      }
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} created successfully!`);
      setOpenCreateDialog(false);
      setFormData({});
    } catch (err) {
      toast.error(`Failed to create ${getTabData().type}`);
      console.error(err);
    }
  };

  // Form handling functions for new components
  const handleOpenBookForm = (book = null) => {
    setEditingItem(book);
    setOpenBookForm(true);
  };

  const handleOpenCategoryForm = (category = null) => {
    setEditingItem(category);
    setOpenCategoryForm(true);
  };

  const handleOpenApiForm = (api = null) => {
    setEditingItem(api);
    setOpenApiForm(true);
  };

  const handleFormSuccess = () => {
    fetchData();
    setEditingItem(null);
  };

  const handleDelete = async (id, type) => {
    try {
      switch (type) {
        case 'book':
          await ApiService.deleteBook(id);
          setBooks(prev => prev.filter(book => book.id !== id));
          break;
        case 'category':
          await ApiService.deleteCategory(id);
          setCategories(prev => prev.filter(category => category.id !== id));
          break;
        case 'api':
          await ApiService.deleteApi(id);
          setApis(prev => prev.filter(api => api.id !== id));
          break;
        case 'user':
          await ApiService.deleteUser(id);
          setUsers(prev => prev.filter(user => user.id !== id));
          break;
        default:
          break;
      }
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully!`);
    } catch (error) {
      toast.error(`Failed to delete ${type}`);
      console.error('Error deleting item:', error);
    }
  };

  // Search functions
  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredData([]);
      return;
    }

    try {
      const { type } = getTabData();
      let searchResults = [];

      switch (searchType) {
        case 'basic':
          switch (type) {
            case 'book':
              searchResults = await ApiService.searchBooks({ title: query });
              break;
            case 'category':
              searchResults = await ApiService.searchCategories({ name: query });
              break;
            default:
              break;
          }
          break;
        case 'advanced':
          switch (type) {
            case 'book':
              searchResults = await ApiService.searchBooks({ title: query, author: query });
              break;
            case 'category':
              searchResults = await ApiService.searchCategories({ name: query });
              break;
            default:
              break;
          }
          break;
        case 'query':
          switch (type) {
            case 'book':
              searchResults = await ApiService.searchBooksByQuery(query);
              break;
            case 'category':
              searchResults = await ApiService.searchCategoriesByQuery(query);
              break;
            case 'api':
              searchResults = await ApiService.getApisByMethod(query.toUpperCase());
              break;
            default:
              break;
          }
          break;
        default:
          break;
      }

      setFilteredData(searchResults.data || []);
      
      if (searchResults.data && searchResults.data.length === 0) {
        toast.info('No results found for your search query');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Search failed. Please try again.');
      setFilteredData([]);
    }
  };

  const handleSearchTypeChange = (newType) => {
    setSearchType(newType);
    setSearchQuery('');
    setFilteredData([]);
  };

  // Get data to display (filtered or original)
  const getDisplayData = () => {
    return searchQuery.trim() ? filteredData : getTabData().data;
  };

  const generateAIMock = async () => {
    const { type } = getTabData();
    setGeneratingMock(true);
    
    try {
      // Simulate AI mock generation - replace with actual AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockData = generateMockData(type);
      setFormData(mockData);
      toast.success('AI mock data generated!');
    } catch (err) {
      toast.error('Failed to generate mock data');
      console.error(err);
    } finally {
      setGeneratingMock(false);
    }
  };

  const generateMockData = (type) => {
    const mockGenerators = {
      user: () => ({
        username: `user_${Math.random().toString(36).substr(2, 8)}`,
        email: `user${Math.floor(Math.random() * 1000)}@example.com`,
        password: 'password123',
        role: Math.random() > 0.8 ? 'ADMIN' : 'USER',
        isActive: Math.random() > 0.3
      }),
      book: () => ({
        title: `Book ${Math.floor(Math.random() * 1000)}`,
        author: `Author ${Math.floor(Math.random() * 100)}`,
        isbn: `ISBN-${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
        description: `This is a mock description for the generated book.`,
        categoryId: categories.length > 0 ? categories[Math.floor(Math.random() * categories.length)].id : '',
        published: Math.random() > 0.5
      }),
      category: () => ({
        name: `Category ${Math.floor(Math.random() * 100)}`,
        description: `Mock category description`,
        isActive: Math.random() > 0.2
      })
    };
    
    return mockGenerators[type] ? mockGenerators[type]() : {};
  };

  const renderFormField = (fieldName, fieldConfig) => {
    const value = formData[fieldName] || '';
    
    switch (fieldConfig.type) {
      case 'string':
      case 'email':
      case 'password':
        return (
          <TextField
            key={fieldName}
            fullWidth
            label={fieldConfig.label}
            value={value}
            onChange={(e) => handleFormChange(fieldName, e.target.value)}
            required={fieldConfig.required}
            type={fieldConfig.type === 'password' ? 'password' : 'text'}
            margin="normal"
          />
        );
      
      case 'textarea':
        return (
          <TextField
            key={fieldName}
            fullWidth
            label={fieldConfig.label}
            value={value}
            onChange={(e) => handleFormChange(fieldName, e.target.value)}
            required={fieldConfig.required}
            multiline
            rows={3}
            margin="normal"
          />
        );
      
      case 'select':
        return (
          <FormControl key={fieldName} fullWidth margin="normal">
            <InputLabel>{fieldConfig.label}</InputLabel>
            <Select
              value={value}
              onChange={(e) => handleFormChange(fieldName, e.target.value)}
              label={fieldConfig.label}
            >
              {fieldConfig.options?.map((option, index) => (
                <MenuItem key={index} value={typeof option === 'object' ? option.value : option}>
                  {typeof option === 'object' ? option.label : option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      
      case 'boolean':
        return (
          <FormControlLabel
            key={fieldName}
            control={
              <Switch
                checked={value}
                onChange={(e) => handleFormChange(fieldName, e.target.checked)}
              />
            }
            label={fieldConfig.label}
            sx={{ mt: 2 }}
          />
        );
      
      default:
        return null;
    }
  };

  const renderTable = (data, type) => {
    if (!data || data.length === 0) {
      return (
        <Paper elevation={2} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No {type}s found
          </Typography>
        </Paper>
      );
    }

    const columns = Object.keys(data[0] || {}).filter(col => 
      !['id', 'password', 'accessToken'].includes(col)
    );
    
    return (
      <TableContainer component={Paper} elevation={2}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column} sx={{ fontWeight: 'bold' }}>
                  {column.charAt(0).toUpperCase() + column.slice(1)}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} hover>
                {columns.map((column) => (
                  <TableCell key={column}>
                    {column === 'category' && item[column] 
                      ? item[column].name 
                      : typeof item[column] === 'boolean' 
                        ? item[column] ? 'Yes' : 'No'
                        : item[column]?.toString() || 'N/A'
                    }
                  </TableCell>
                ))}
                <TableCell>
                  <Box display="flex" gap={1}>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => {
                        switch (type) {
                          case 'book':
                            handleOpenBookForm(item);
                            break;
                          case 'category':
                            handleOpenCategoryForm(item);
                            break;
                          case 'api':
                            handleOpenApiForm(item);
                            break;
                          default:
                            break;
                        }
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(item.id, type)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const { data, title, icon, color, type } = getTabData();

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Smart MockData Generator Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          View data from your backend APIs and create new items
        </Typography>
      </Box>

      {/* API Status Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Users API
                  </Typography>
                  <Typography variant="h4" component="div">
                    {users.length}
                  </Typography>
                </Box>
                <PeopleIcon color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Books API
                  </Typography>
                  <Typography variant="h4" component="div">
                    {books.length}
                  </Typography>
                </Box>
                <BookIcon color="secondary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card elevation={2}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" gutterBottom>
                    Categories API
                  </Typography>
                  <Typography variant="h4" component="div">
                    {categories.length}
                  </Typography>
                </Box>
                <CategoryIcon color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Action Buttons */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
            color={color}
          >
            Create New {title.slice(0, -1)}
          </Button>
          <Button
            variant="outlined"
            startIcon={<AutoAwesomeIcon />}
            onClick={generateAIMock}
            disabled={generatingMock}
            color={color}
          >
            {generatingMock ? 'Generating...' : 'Generate AI Mock'}
          </Button>
        </Box>
        
        <Chip
          icon={<RefreshIcon />}
          label="Refresh Data"
          onClick={fetchData}
          disabled={loading}
          clickable
          color="primary"
          variant="outlined"
        />
      </Box>

      {/* Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
              fontWeight: 500
            }
          }}
        >
          <Tab
            icon={<PeopleIcon />}
            label="Users"
            iconPosition="start"
            sx={{ color: activeTab === 0 ? 'primary.main' : 'text.secondary' }}
          />
          <Tab
            icon={<BookIcon />}
            label="Books"
            iconPosition="start"
            sx={{ color: activeTab === 1 ? 'secondary.main' : 'text.secondary' }}
          />
          <Tab
            icon={<CategoryIcon />}
            label="Categories"
            iconPosition="start"
            sx={{ color: activeTab === 2 ? 'success.main' : 'text.secondary' }}
          />
          <Tab
            icon={<AutoAwesomeIcon />}
            label="API Endpoints"
            iconPosition="start"
            sx={{ color: activeTab === 3 ? 'info.main' : 'text.secondary' }}
          />
        </Tabs>
      </Paper>

      {/* Content */}
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{ color: `${color}.main` }}>
            {icon}
          </Box>
          <Typography variant="h5" component="h2">
            {title} Data
          </Typography>
          <Chip
            label={`${getDisplayData().length} items`}
            color={color}
            variant="outlined"
            size="small"
          />
        </Box>

        {/* Search Bar */}
        <SearchBar
          onSearch={handleSearch}
          searchType={searchType}
          onSearchTypeChange={handleSearchTypeChange}
          placeholder={`Search ${title.toLowerCase()}...`}
        />

        {loading ? (
          <Box display="flex" justifyContent="center" py={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : (
          renderTable(getDisplayData(), type)
        )}
      </Paper>

      {/* API Information */}
      <Paper elevation={1} sx={{ p: 3, mt: 3, bgcolor: 'grey.50' }}>
        <Typography variant="h6" gutterBottom>
          Available API Endpoints
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="primary" gutterBottom>
              Users API
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/users
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              POST /api/users
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              PUT /api/users/{'{id}'}
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              DELETE /api/users/{'{id}'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="secondary" gutterBottom>
              Books API
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/books
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/books/{'{id}'}
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              POST /api/books
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              PUT /api/books/{'{id}'}
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              DELETE /api/books/{'{id}'}
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/books/search
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/books/search/query
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="success" gutterBottom>
              Categories API
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/categories
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/categories/{'{id}'}
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              POST /api/categories
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              PUT /api/categories/{'{id}'}
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              DELETE /api/categories/{'{id}'}
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/categories/search
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/categories/active
            </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Typography variant="subtitle2" color="info" gutterBottom>
              API Endpoints
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/apis
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/apis/{'{id}'}
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              POST /api/apis
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              PUT /api/apis/{'{id}'}
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              DELETE /api/apis/{'{id}'}
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/apis/active
            </Typography>
            <Typography variant="body2" fontFamily="monospace">
              GET /api/apis/method/{'{method}'}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Create Dialog */}
      <Dialog 
        open={openCreateDialog} 
        onClose={() => setOpenCreateDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Create New {title.slice(0, -1)}
            </Typography>
            <IconButton onClick={() => setOpenCreateDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            {Object.keys(modelStructure).map(fieldName => 
              renderFormField(fieldName, modelStructure[fieldName])
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenCreateDialog(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color={color}
          >
            Create {title.slice(0, -1)}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Action Buttons */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            switch (type) {
              case 'book':
                handleOpenBookForm();
                break;
              case 'category':
                handleOpenCategoryForm();
                break;
              case 'api':
                handleOpenApiForm();
                break;
              default:
                handleCreateClick();
                break;
            }
          }}
          sx={{ minWidth: 150 }}
        >
          Add New {title.slice(0, -1)}
        </Button>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={fetchData}
        >
          Refresh Data
        </Button>
      </Box>

      {/* Form Components */}
      <BookForm
        open={openBookForm}
        onClose={() => {
          setOpenBookForm(false);
          setEditingItem(null);
        }}
        book={editingItem}
        onSuccess={handleFormSuccess}
      />

      <CategoryForm
        open={openCategoryForm}
        onClose={() => {
          setOpenCategoryForm(false);
          setEditingItem(null);
        }}
        category={editingItem}
        onSuccess={handleFormSuccess}
      />

      <ApiForm
        open={openApiForm}
        onClose={() => {
          setOpenApiForm(false);
          setEditingItem(null);
        }}
        api={editingItem}
        onSuccess={handleFormSuccess}
      />
    </Container>
  );
};

export default Dashboard;