import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import formatDateToYyyymmdd from '../../../Utility/formatDateToYyyymmdd';
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';
import useAuth from '../../../Hooks/useAuth';

const EditScholarship = () => {
  const { id } = useParams();
  const {user} = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [scholarship, setScholarship] = useState({
    universityName: '',
    universityImage: '',
    scholarshipCategory: '',
    universityCountry: '',
    universityCity: '',
    applicationDeadline: '',
    subjectCategory: '',
    applicationFees: 0,
    details: '',
    stipend: 0,
    postDate: '',
    serviceCharge: 0,
  });

  useEffect(() => {
    fetchScholarshipDetails();
  }, []);

  const fetchScholarshipDetails = async () => {
    try {
      const { data } = await axiosSecure.get(`/details/${id}?email=${user.email}`);
      // Assuming the fetched data has properties matching the scholarship state
      setScholarship(data);
    } catch (error) {
      console.error('Error fetching scholarship details:', error);
      // Handle error state or display error message to user
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Convert applicationDeadline and postDate to ISO format if they are date fields
    const updatedValue = (name === 'applicationDeadline' || name === 'postDate') ? new Date(value).toISOString() : value;

    setScholarship((prevScholarship) => ({
      ...prevScholarship,
      [name]: updatedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosSecure.put(`/updateScholarship/${id}?email=${user.email}`, scholarship);
      Swal.fire({
        title: 'Updated!',
        text: 'Scholarship details have been updated.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/dashboard/manageScholarships');
    } catch (error) {
      console.error('Error updating scholarship:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to update scholarship. Please try again later.',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
      // Handle error (e.g., show error message)
    }
  };

  return (
    <div className="flex justify-center items-center overflow-x-auto">
      <div className="w-full max-w-lg">
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="universityName">
              University Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="universityName"
              name="universityName"
              type="text"
              placeholder="University Name"
              value={scholarship.universityName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="universityImage">
              University Image URL
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="universityImage"
              name="universityImage"
              type="text"
              placeholder="University Image URL"
              value={scholarship.universityImage}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scholarshipCategory">
              Scholarship Category
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="scholarshipCategory"
              name="scholarshipCategory"
              type="text"
              placeholder="Scholarship Category"
              value={scholarship.scholarshipCategory}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="universityCountry">
              University Country
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="universityCountry"
              name="universityCountry"
              type="text"
              placeholder="University Country"
              value={scholarship.universityCountry}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="universityCity">
              University City
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="universityCity"
              name="universityCity"
              type="text"
              placeholder="University City"
              value={scholarship.universityCity}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="applicationDeadline">
              Application Deadline
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="applicationDeadline"
              name="applicationDeadline"
              type="date"
              value={formatDateToYyyymmdd(scholarship.applicationDeadline)}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subjectCategory">
              Subject Category
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="subjectCategory"
              name="subjectCategory"
              type="text"
              placeholder="Subject Category"
              value={scholarship.subjectCategory}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="applicationFees">
              Application Fees
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="applicationFees"
              name="applicationFees"
              type="number"
              placeholder="Application Fees"
              value={scholarship.applicationFees}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="details">
              Details
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="details"
              name="details"
              placeholder="Details"
              value={scholarship.details}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="stipend">
              Stipend
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="stipend"
              name="stipend"
              type="number"
              placeholder="Stipend"
              value={scholarship.stipend}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postDate">
              Post Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="postDate"
              name="postDate"
              type="date"
              value={formatDateToYyyymmdd(scholarship.postDate)}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="serviceCharge">
              Service Charge
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="serviceCharge"
              name="serviceCharge"
              type="number"
              placeholder="Service Charge"
              value={scholarship.serviceCharge}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Save Changes
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={() => navigate('/dashboard/manageScholarships')}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditScholarship;

