import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import formatDateToDdmmyyyy from '../../Utility/formatDateToDdmmyyyy';
import Swal from 'sweetalert2';
import useAuth from '../../Hooks/useAuth';

const UserPanel = () => {

  const [userRole, setUserRole] = useState(null);

  const {user} = useAuth();
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.post (`${import.meta.env.VITE_URL}/checkUserRole`, { email: user?.email});
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, [user]);
  
  const [selectedRole, setSelectedRole] = useState(''); // State to store selected role filter
  const queryClient = useQueryClient(); // Query client instance

  const { data: users = [], isError, error } = useQuery({
    queryKey: ['users', selectedRole], // Include selectedRole in queryKey
    queryFn: async () => {
      const { data } = await axios(`${import.meta.env.VITE_URL}/users?role=${selectedRole}`);
      return data;
    },
  });

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    queryClient.invalidateQueries('users'); // Invalidate and refetch 'users' query
  };

  const handleRoleUpdate = (userId, newRole) => {
    Swal.fire({
      title: 'Update User Role',
      text: `Are you sure you want to update user's role to ${newRole}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, update it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Send request to update user role
        axios.put(`${import.meta.env.VITE_URL}/users/${userId}/role`, { role: newRole })
          .then(response => {
            Swal.fire({
              title: 'Updated!',
              text: 'User role has been updated successfully.',
              icon: 'success',
              timer: 1500,
              showConfirmButton: false
            });
            // Invalidate users query to refetch updated data
            queryClient.invalidateQueries('users');
          })
          .catch(error => {
            console.error('Error updating user role:', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to update user role. Please try again later.',
              icon: 'error',
              timer: 1500,
              showConfirmButton: false
            });
          });
      }
    });
  };

  return (
    <>
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
          Filter by Role
        </div>
        <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
          <li>
            <a onClick={() => handleRoleFilter('')}>All</a>
          </li>
          <li>
            <a onClick={() => handleRoleFilter('admin')}>Admin</a>
          </li>
          <li>
            <a onClick={() => handleRoleFilter('moderator')}>Moderator</a>
          </li>
          <li>
            <a onClick={() => handleRoleFilter('user')}>User</a>
          </li>
        </ul>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined on</th>
              <th>User Role</th>
              {userRole==='admin' && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {/* Rows */}
            {users.map((user, idx) => (
              <tr key={idx}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img src={user.photo} alt="Avatar" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{formatDateToDdmmyyyy(user.createdAt)}</td>
                <td className="capitalize">{user.userRole || 'User'}</td>
                {userRole === 'admin' && <td>
                  <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn m-1">
                      Promote
                    </div>
                    <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                      {user.userRole !== 'admin' && (
                        <>
                          <li>
                            <a onClick={() => handleRoleUpdate(user._id, 'admin')}>Change to Admin</a>
                          </li>
                          <li>
                            <a onClick={() => handleRoleUpdate(user._id, 'moderator')}>Change to Moderator</a>
                          </li>
                          <li>
                            <a onClick={() => handleRoleUpdate(user._id, 'user')}>Change to User</a>
                          </li>
                        </>
                      )}
                      {user.userRole === 'admin' && (
                        <li>
                          <a>Admin</a>
                        </li>
                      )}
                    </ul>
                  </div>
                </td>}
              </tr>
            ))}
            {/* Show message if no users found */}
            {users.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserPanel;
