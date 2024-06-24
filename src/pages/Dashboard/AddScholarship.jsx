import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import formatDateToYyyymmdd from '../../Utility/formatDateToYyyymmdd';

const imghosting = import.meta.env.VITE_IMG;
const imgUpload = `https://api.imgbb.com/1/upload?key=${imghosting}`;

const AddScholarship = () => {
  const navigate = useNavigate();

  const initialScholarshipState = {
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
  };

  const [scholarship, setScholarship] = useState(initialScholarshipState);
  const [universityImageFile, setUniversityImageFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const updatedValue = (name === 'applicationDeadline' || name === 'postDate') ? new Date(value).toISOString() : value;

    setScholarship((prevScholarship) => ({
      ...prevScholarship,
      [name]: updatedValue,
    }));
  };

  const handleImageChange = (e) => {
    setUniversityImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let universityImageUrl = '';

      if (universityImageFile) {
        const imgFile = new FormData();
        imgFile.append('image', universityImageFile);

        const res = await axios.post(imgUpload, imgFile);
        if (res.data.success) {
          universityImageUrl = res.data.data.display_url;
        } else {
          Swal.fire({
            title: 'Error',
            text: 'Failed to upload university image. Please try again later.',
            icon: 'error',
            timer: 1500,
            showConfirmButton: false,
          });
          return;
        }
      }

      const newScholarship = {
        ...scholarship,
        universityImage: universityImageUrl,
      };

      const response = await axios.post(`${import.meta.env.VITE_URL}/addScholarship`, newScholarship);
      Swal.fire({
        title: 'Added!',
        text: 'New scholarship has been added.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
      });
      navigate('/dashboard/manageScholarships');
    } catch (error) {
      console.error('Error adding scholarship:', error);
      Swal.fire({
        title: 'Error',
        text: 'Failed to add scholarship. Please try again later.',
        icon: 'error',
        timer: 1500,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div className="flex justify-center items-center overflow-auto">
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
              University Image
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="universityImage"
              name="universityImage"
              type="file"
              onChange={handleImageChange}
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
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Add Scholarship
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

export default AddScholarship;
