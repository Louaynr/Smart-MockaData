import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  FormHelperText
} from '@mui/material';
import { toast } from 'react-toastify';
import ApiService from '../services/api.service';

const ApiForm = ({ open, onClose, api = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    method: 'GET',
    isActive: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const httpMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'];

  useEffect(() => {
    if (open) {
      if (api) {
        setFormData({
          name: api.name || '',
          description: api.description || '',
          url: api.url || '',
          method: api.method || 'GET',
          isActive: api.isActive !== undefined ? api.isActive : true
        });
      } else {
        setFormData({
          name: '',
          description: '',
          url: '',
          method: 'GET',
          isActive: true
        });
      }
      setErrors({});
    }
  }, [open, api]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.url.trim()) newErrors.url = 'URL is required';
    if (!formData.method) newErrors.method = 'HTTP method is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (api) {
        await ApiService.updateApi(api.id, formData);
        toast.success('API endpoint updated successfully!');
      } else {
        await ApiService.createApi(formData);
        toast.success('API endpoint created successfully!');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving API endpoint:', error);
      toast.error(api ? 'Failed to update API endpoint' : 'Failed to create API endpoint');
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
        {api ? 'Edit API Endpoint' : 'Create New API Endpoint'}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth error={!!errors.method}>
              <InputLabel>HTTP Method</InputLabel>
              <Select
                value={formData.method}
                onChange={(e) => handleChange('method', e.target.value)}
                label="HTTP Method"
              >
                {httpMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </Select>
              {errors.method && <FormHelperText>{errors.method}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="URL"
              value={formData.url}
              onChange={(e) => handleChange('url', e.target.value)}
              error={!!errors.url}
              helperText={errors.url}
              required
              placeholder="/api/example"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => handleChange('isActive', e.target.checked)}
                />
              }
              label="Active"
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
          {loading ? 'Saving...' : (api ? 'Update' : 'Create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApiForm; 