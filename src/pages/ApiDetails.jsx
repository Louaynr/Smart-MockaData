import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Code as CodeIcon,
  Description as DescriptionIcon,
  Http as HttpIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import ApiService from '../services/api.service';

const ApiDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchApiDetails();
  }, [id]);

  const fetchApiDetails = async () => {
    try {
      setLoading(true);
      // For now, we'll show a mock API structure since the backend doesn't have /apis endpoint
      // In a real scenario, you would call: const response = await ApiService.getApiById(id);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock API data structure
      const mockApiData = {
        id: id,
        name: `API ${id}`,
        description: 'This is a sample API endpoint for demonstration purposes.',
        baseUrl: 'http://localhost:8080/api',
        version: '1.0.0',
        status: 'active',
        endpoints: [
          {
            method: 'GET',
            path: '/users',
            description: 'Retrieve all users',
            requiresAuth: true,
            parameters: []
          },
          {
            method: 'POST',
            path: '/users',
            description: 'Create a new user',
            requiresAuth: true,
            parameters: [
              { name: 'username', type: 'string', required: true },
              { name: 'email', type: 'string', required: true },
              { name: 'password', type: 'string', required: true }
            ]
          },
          {
            method: 'GET',
            path: '/books',
            description: 'Retrieve all books',
            requiresAuth: false,
            parameters: []
          },
          {
            method: 'POST',
            path: '/books',
            description: 'Create a new book',
            requiresAuth: true,
            parameters: [
              { name: 'title', type: 'string', required: true },
              { name: 'author', type: 'string', required: true },
              { name: 'description', type: 'string', required: false }
            ]
          }
        ],
        documentation: 'This API provides endpoints for managing users, books, and categories in the Smart MockData Generator system.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setApiData(mockApiData);
    } catch (err) {
      setError('Failed to fetch API details');
      toast.error('Failed to load API details');
      console.error('Error fetching API details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error || !apiData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'API not found'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
        >
          Back to Dashboard
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          {apiData.name}
        </Typography>
        
        <Typography variant="h6" color="text.secondary" gutterBottom>
          {apiData.description}
        </Typography>
        
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Chip 
            icon={<CodeIcon />} 
            label={`v${apiData.version}`} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            icon={<HttpIcon />} 
            label={apiData.status} 
            color={apiData.status === 'active' ? 'success' : 'error'} 
            variant="outlined" 
          />
          <Chip 
            icon={<SecurityIcon />} 
            label="JWT Auth" 
            color="warning" 
            variant="outlined" 
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* API Information */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DescriptionIcon color="primary" />
              API Information
            </Typography>
            
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Base URL
              </Typography>
              <Typography variant="body2" fontFamily="monospace" sx={{ mb: 2 }}>
                {apiData.baseUrl}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Documentation
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {apiData.documentation}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Created
              </Typography>
              <Typography variant="body2" sx={{ mb: 2 }}>
                {new Date(apiData.createdAt).toLocaleDateString()}
              </Typography>
              
              <Typography variant="subtitle2" color="text.secondary">
                Last Updated
              </Typography>
              <Typography variant="body2">
                {new Date(apiData.updatedAt).toLocaleDateString()}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Endpoints */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <HttpIcon color="secondary" />
              Available Endpoints
            </Typography>
            
            <List>
              {apiData.endpoints.map((endpoint, index) => (
                <React.Fragment key={index}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      <Chip 
                        label={endpoint.method} 
                        color={endpoint.method === 'GET' ? 'success' : 'primary'}
                        size="small"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" fontFamily="monospace">
                            {endpoint.path}
                          </Typography>
                          {endpoint.requiresAuth && (
                            <Chip label="Auth Required" size="small" color="warning" />
                          )}
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {endpoint.description}
                          </Typography>
                          {endpoint.parameters.length > 0 && (
                            <Box>
                              <Typography variant="caption" color="text.secondary">
                                Parameters:
                              </Typography>
                              <Box sx={{ mt: 0.5 }}>
                                {endpoint.parameters.map((param, paramIndex) => (
                                  <Chip
                                    key={paramIndex}
                                    label={`${param.name}: ${param.type}${param.required ? ' *' : ''}`}
                                    size="small"
                                    variant="outlined"
                                    sx={{ mr: 0.5, mb: 0.5 }}
                                  />
                                ))}
                              </Box>
                            </Box>
                          )}
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < apiData.endpoints.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Usage Examples */}
      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Usage Examples
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Authentication
                </Typography>
                <Typography variant="body2" fontFamily="monospace" sx={{ fontSize: '0.8rem' }}>
                  POST /api/auth/signin
                  {`\n`}
                  {`\n`}
                  {`{`}
                  {`\n  "username": "admin",`}
                  {`\n  "password": "admin123"`}
                  {`\n}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  Create User
                </Typography>
                <Typography variant="body2" fontFamily="monospace" sx={{ fontSize: '0.8rem' }}>
                  POST /api/users
                  {`\n`}
                  Authorization: Bearer {`{token}`}
                  {`\n`}
                  {`{`}
                  {`\n  "username": "newuser",`}
                  {`\n  "email": "user@example.com",`}
                  {`\n  "password": "password123"`}
                  {`\n}`}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ApiDetails;
