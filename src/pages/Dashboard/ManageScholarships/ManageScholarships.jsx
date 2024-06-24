import React, { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import Swal from 'sweetalert2';
import Lottie from 'lottie-react';
import loading from "../../../assets/loading.json";
import useAuth from '../../../Hooks/useAuth';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';

const ManageScholarships = () => {
  const queryClient = useQueryClient();
  const {user} = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
 

  const {
    data: scholarships = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_URL}/allScholarship`);
      return data;
    },
    queryKey: ["scholarships"],
  });

  const handleDelete = (deleteId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${import.meta.env.VITE_URL}/deleteScholarship/${deleteId}?email=${user.email}`)
          .then(response => {
            Swal.fire({
              title: "Deleted!",
              text: "The scholarship has been deleted.",
              icon: "success",
              timer: 1500,
              showConfirmButton: false
            });
            // Invalidate the scholarships query to refetch data
            queryClient.invalidateQueries("scholarships");
          })
          .catch(error => {
            console.error('Error deleting scholarship:', error);
            Swal.fire({
              title: "Error",
              text: "Failed to delete scholarship. Please try again later.",
              icon: "error",
              timer: 1500,
              showConfirmButton: false
            });
            // Handle error (e.g., show error message)
          });
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center  min-h-[calc(100vh-300px)]">
        <Lottie animationData={loading} loop={true} className="h-44"></Lottie>
      </div>
    );
  }

  if (isError || error) {
    console.error(error);
  }
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th></th>
              <th>University Name</th>
              <th>Scholarship Category</th>
              <th>Subject Category</th>
              <th>Application Fees</th>
              <th></th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {scholarships.map((scholarship, idx) => (
              <tr key={idx} className="hover">
                <th>{idx + 1}</th>
                <td>{scholarship.universityName}</td>
                <td>{scholarship.scholarshipCategory}</td>
                <td>{scholarship.subjectCategory}</td>
                <td>{scholarship.applicationFees}</td>
                <td>
                  <Link to={`/details/${scholarship._id}`} className="btn btn-link"> Details</Link>
                </td>
                <td>
                  <button onClick={()=>navigate(`/dashboard/editScholarship/${scholarship._id}`)}><FaEdit className="hover:scale-[2]"></FaEdit></button>
                </td>
                <td>
                  <button onClick={() => handleDelete(scholarship._id)}>
                    <MdCancel className="hover:scale-[2]" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ManageScholarships;
