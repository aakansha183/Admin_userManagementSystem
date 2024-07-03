import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Link, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';
import localforage from 'localforage';

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [roleType, setRoleType] = useState('user');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true); // Set loading to true when form is submitted
    try {
      await login(username, password, roleType);
      const users: User[] = await localforage.getItem('users') || [];

      const loggedInUser = users.find(user => user.username === username && user.password === password);

      if (loggedInUser && loggedInUser.roleType === roleType) {
        if (roleType === 'admin') {
          navigate('/user-list');
        } else {
          navigate(`/profile/${loggedInUser.id}`);
        }
      } else {
        setError('Invalid credentials or incorrect role type. Please try again or register.');
      }
    } catch (e) {
      setError('Invalid credentials or incorrect role type. Please try again or register.');
    } finally {
      setLoading(false); // Reset loading after login attempt
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={Boolean(error)}
          helperText={error}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Password"
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={Boolean(error)}
          helperText={error}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="roleType-label">Role Type</InputLabel>
          <Select
            labelId="roleType-label"
            id="roleType"
            value={roleType}
            onChange={(e) => setRoleType(e.target.value as string)}
            label="Role Type"
            name="roleType"
          >
            <MenuItem value="user">User</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </Select>
        </FormControl>
        {error && <Typography color="error">{error}</Typography>}
        <Box mt={2}>
          <Button color="primary" variant="contained" type="submit">
            Login
          </Button>
        </Box>
        {loading && (
          <Box mt={2} display="flex" justifyContent="center">
            <CircularProgress size={24} />
          </Box>
        )}
      </form>
      <Box mt={2}>
        <Typography variant="body1">
          Don't have an account? <Link href="/register">Register Now</Link>
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;

