import React, { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box, Link } from '@mui/material';
import localforage from 'localforage';
import { useAuth } from '../context/AuthContext'; // Import useAuth hook

interface User {
  id: string;
  username: string;
  roleType: 'user' | 'admin';
  name: string;
  address: string;
  phoneNumber: string;
}

const ProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { logout } = useAuth(); // Access logout function from authentication context
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const users: User[] = await localforage.getItem('users') || [];
        const currentUser = users.find(user => user.id === id);
        if (currentUser) {
          setProfile(currentUser);
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const values: Partial<User> = {
      username: formData.get('username') as string,
      name: formData.get('name') as string,
      address: formData.get('address') as string,
      phoneNumber: formData.get('phoneNumber') as string,
    };

    try {
      const users: User[] = await localforage.getItem('users') || [];
      const updatedUsers = users.map(u => u.id === id ? { ...u, ...values } : u);
      await localforage.setItem('users', updatedUsers);
      setProfile(prevProfile => prevProfile ? { ...prevProfile, ...values } : null);
      setLoading(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h6">Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">{error}</Typography>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container>
        <Typography variant="h6">User not found.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Edit Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          margin="normal"
          label="Username"
          name="username"
          defaultValue={profile.username}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Name"
          name="name"
          defaultValue={profile.name}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Address"
          name="address"
          defaultValue={profile.address}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Phone Number"
          name="phoneNumber"
          defaultValue={profile.phoneNumber}
        />
        <Box mt={2}>
          <Button type="submit" variant="contained" color="primary">
            Update Profile
          </Button>
          <Button variant="outlined" color="secondary" style={{ marginLeft: '10px' }} onClick={logout}>
            Logout
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default ProfilePage;
