import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import { toast } from 'react-toastify';
import ApiService from '../services/api.service';

const BookForm = ({ open, onClose, book = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    description: '',
    price: '',
    categoryId: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      fetchCategories();
      if (book) {
        setFormData({
          title: book.title || '',
          author: book.author || '',
          isbn: book.isbn || '',
          description: book.description || '',
          price: book.price || '',
          categoryId: book.category?.id || ''
        });
      } else {
        setFormData({
          title: '',
          author: '',
          isbn: '',
          description: '',
          price: '',
          categoryId: ''
        });
      }
      setErrors({});
    }
  }, [open, book]);

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getAllCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN is required';
    if (formData.price && isNaN(formData.price)) newErrors.price = 'Price must be a number';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const bookData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        category: formData.categoryId ? { id: parseInt(formData.categoryId) } : null
      };

      if (book) {
        await ApiService.updateBook(book.id, bookData);
        toast.success('Book updated successfully!');
      } else {
        await ApiService.createBook(bookData);
        toast.success('Book created successfully!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error(book ? 'Failed to update book' : 'Failed to create book');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {book ? 'Edit Book' : 'Create New Book'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              error={!!errors.title}
              helperText={errors.title}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Author"
              value={formData.author}
              onChange={(e) => handleChange('author', e.target.value)}
              error={!!errors.author}
              helperText={errors.author}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="ISBN"
              value={formData.isbn}
              onChange={(e) => handleChange('isbn', e.target.value)}
              error={!!errors.isbn}
              helperText={errors.isbn}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => handleChange('price', e.target.value)}
              error={!!errors.price}
              helperText={errors.price}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.categoryId}
                onChange={(e) => handleChange('categoryId', e.target.value)}
                label="Category"
              >
                <MenuItem value="">
                  <em>No category</em>
                </MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
        >
          {loading ? 'Saving...' : (book ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookForm; 