import React, { useEffect, useState } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";
import Swal from 'sweetalert2';

const ManageScholarships = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [scholarships, setScholarships] = useState([]);

  // Fetch all scholarships
  const fetchScholarships = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_URL}/allScholarship`);
      setScholarships(data);
    } catch (error) {
      console.error('Error fetching scholarships:', error);
      // Handle error state or display error message to user
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchScholarships();
  }, []);

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
        axios.delete(`${import.meta.env.VITE_URL}/deleteScholarship/${deleteId}`)
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
