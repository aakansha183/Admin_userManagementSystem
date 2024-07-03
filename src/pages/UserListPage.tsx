import React, { useState, useEffect } from 'react';
import { Container, Typography, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { Link } from 'react-router-dom';
import localforage from 'localforage';
import Loader from '../components/Loader';
import { grey, blue } from '@mui/material/colors';
import { User } from '../types';
import { styled } from '@mui/system';

const UserListContainer = styled(Container)({
  marginTop: '32px',
  backgroundColor: '#f9f9f9',
  padding: '24px',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const UserListItem = styled(ListItem)({
  backgroundColor: '#ffffff',
  marginBottom: '16px',
  borderRadius: '8px',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${grey[300]}`,
  transition: 'background-color 0.3s, transform 0.3s',
  '&:hover': {
    backgroundColor: grey[200],
    transform: 'scale(1.02)',
  },
});

const UserListButton = styled(ListItemButton)({
  padding: '16px',
  borderRadius: '8px',
  color: blue[700],
  '&:hover': {
    color: blue[900],
  },
});

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const storedUsers: User[] = (await localforage.getItem('users')) || [];

      // Filter out admin users
      const nonAdminUsers = storedUsers.filter((user) => user.roleType !== 'admin');

      setUsers(nonAdminUsers);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <Loader />;

  return (
    <UserListContainer maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        User List
      </Typography>
      <List>
        {users.map((user) => (
          <UserListItem key={user.id}>
            <UserListButton>
              <Link to={`/profile/${user.id}`} style={{ textDecoration: 'none', color: 'inherit', width: '100%' }}>
                <ListItemText
                  primary={<Typography variant="h6">{user.username}</Typography>}
                  secondary={user.roleType}
                />
              </Link>
            </UserListButton>
          </UserListItem>
        ))}
      </List>
    </UserListContainer>
  );
};

export default UserListPage;


