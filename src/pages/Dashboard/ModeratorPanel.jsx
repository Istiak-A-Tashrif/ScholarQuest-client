import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import formatDateToDdmmyyyy from '../../Utility/formatDateToDdmmyyyy';

const ModeratorPanel = () => {
    const {data: users = [], isError, error} = useQuery({
        queryFn: async () => {
            const {data} = await axios (`${import.meta.env.VITE_URL}/users`)
            return data;
          },
        queryKey: ['users'],
      })
    return (
        <>
        <div className="overflow-x-auto">
  <table className="table">
    {/* head */}
    <thead>
      <tr>
        
        <th>Name</th>
        <th>email</th>
        <th>Joined on</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      {/* row 1 */}
      {users.map((user, idx) => {
            return (
                <tr key={idx}>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="avatar">
                      <div className="mask mask-squircle h-12 w-12">
                        <img
                          src={user.photo}
                          alt="Avatar Tailwind CSS Component" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td>
                  {user.email}
                </td>
                <td>{formatDateToDdmmyyyy(user.createdAt)}</td>
              </tr>
            );
          })
        }
    </tbody>
  </table>
</div>
        </>
    );
};

export default ModeratorPanel;