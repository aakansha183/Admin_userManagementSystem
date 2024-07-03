import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import localforage from 'localforage';
import { TextField, Button, Container, Typography, Box, FormControl, InputLabel, MenuItem, Select, CircularProgress } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

interface User {
  id: string;
  username: string;
  roleType: 'user' | 'admin';
  password: string;
  name: string;
  address: string;
  phoneNumber: string;
}

type RegisterFormData = {
  username: string;
  password: string;
  name: string;
  address: string;
  phoneNumber: string;
  roleType: 'user' | 'admin';
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { control, handleSubmit } = useForm<RegisterFormData>({
    defaultValues: {
      username: '',
      password: '',
      name: '',
      address: '',
      phoneNumber: '',
      roleType: 'user',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    const newUser: User = {
      id: uuidv4(),
      username: data.username,
      password: data.password,
      roleType: data.roleType,
      name: data.name,
      address: data.address,
      phoneNumber: data.phoneNumber,
    };

    try {
      const users: User[] = await localforage.getItem('users') || [];

      const adminCount = users.filter(user => user.roleType === 'admin').length;
      const userCount = users.filter(user => user.roleType === 'user').length;

      if (newUser.roleType === 'admin' && adminCount >= 1) {
        throw new Error('Cannot add more than one admin.');
      }

      if (adminCount >= 1 && userCount >= 5) {
        throw new Error('Maximum limit reached for users.');
      }

      users.push(newUser);
      await localforage.setItem('users', users);
      setLoading(false);

      if (data.roleType === 'admin') {
        navigate('/user-list');
      } else {
        navigate('/login');
      }
    } catch (err) {
      const errorMessage = (err as Error).message || 'Failed to register. Please try again.';
      setError(errorMessage);
      setLoading(false);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Register
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="username"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth margin="normal" label="Username" required />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth margin="normal" label="Password" type="password" required />
          )}
        />
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth margin="normal" label="Name" required />
          )}
        />
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth margin="normal" label="Address" required />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <TextField {...field} fullWidth margin="normal" label="Phone Number" required />
          )}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="roleType-label">Role Type</InputLabel>
          <Controller
            name="roleType"
            control={control}
            render={({ field }) => (
              <Select {...field} labelId="roleType-label" id="roleType" label="Role Type">
                <MenuItem value="user">User</MenuItem>
                <MenuItem value="admin">Admin</MenuItem>
              </Select>
            )}
          />
        </FormControl>
        {error && <Typography color="error">{error}</Typography>}
        <Box mt={2}>
          <Button color="primary" variant="contained" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
        {loading && (
          <Box mt={2} display="flex" justifyContent="center">
            <CircularProgress size={24} />
          </Box>
        )}
      </form>
    </Container>
  );
};

export default RegisterPage;
