import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../Hooks/useAuth';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const imghosting = import.meta.env.VITE_IMG;
const imgUpload = `https://api.imgbb.com/1/upload?key=${imghosting}`;

const ScholarshipApplicationForm = () => {
  const location = useLocation();
  const state = location.state || {};
  const { scholarshipDetails } = state;

  const { user } = useAuth();
  const { handleSubmit, register, formState: { errors }, setError } = useForm();

  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false); // State to manage submit button disabled state

  // Check if the user has already applied
  const { data: alreadyApplied } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_URL}/checkApply`, {
        params: { email: user.email, scholarshipId: scholarshipDetails?._id }
      });
      return data;
    },
    queryKey: ["checkApply", user?.email, scholarshipDetails?._id],
    enabled: !!scholarshipDetails?._id, // Enable query only when scholarshipDetails._id exists
  });

  const submitForm = async (formData) => {
    setIsSubmitting(true); // Set loading state to true during form submission
    try {
      const imgFile = new FormData();
      imgFile.append('image', formData.photo[0]);

      const res = await axios.post(imgUpload, imgFile);

      if (res.data.success) {
        const finalFormData = {
          ...formData,
          photo: res.data.data.display_url,
          userName: user.displayName,
          userEmail: user.email,
          scholarshipId: scholarshipDetails._id,
          currentDate: new Date().toISOString(),
          scholarshipDetails,
          status: "Pending"
        };

        // Submit the form data
        await axios.post(`${import.meta.env.VITE_URL}/scholarApply`, finalFormData);

        Swal.fire({
          title: "Success",
          text: "You applied successfully",
          icon: "success"
        });

        queryClient.invalidateQueries({ queryKey: ["checkApply"] });

      } else {
        setError("photo", {
          type: "server",
          message: "Failed to upload photo. Please try again."
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      Swal.fire({
        title: "Error",
        text: "Failed to submit your application. Please try again later.",
        icon: "error"
      });
    } finally {
      setIsSubmitting(false); // Reset loading state after form submission completes
    }
  };

  if (alreadyApplied) {
    return (
      <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow-lg mb-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Already Applied</h2>
        <p className="text-lg text-gray-700">You have already applied for this scholarship.</p>
        <p className='text-blue-500 mt-6'><Link to={"/dashboard/myapplication"}>See My Applications</Link></p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow-lg mb-6">
      <form onSubmit={handleSubmit(submitForm)}>
        {/* Applicant phone number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="number" {...register('phoneNumber', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          {errors.phoneNumber && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        {/* Applicant photo */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Photo</label>
          <input type="file" {...register('photo', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          {errors.photo && <span className="text-red-500 text-sm">{errors.photo.message}</span>}
        </div>

        {/* Applicant address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input type="text" {...register('address', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          {errors.address && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        {/* Applicant gender */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <select {...register('gender', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        {/* Applicant degree */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Degree</label>
          <select {...register('degree', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
            <option value="diploma">Diploma</option>
            <option value="bachelor">Bachelor</option>
            <option value="masters">Masters</option>
          </select>
          {errors.degree && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        {/* SSC Result */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">SSC Result</label>
          <input type="text" {...register('sscResult', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          {errors.sscResult && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        {/* HSC Result */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">HSC Result</label>
          <input type="text" {...register('hscResult', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          {errors.hscResult && <span className="text-red-500 text-sm">This field is required</span>}
        </div>

        {/* Study gap (optional) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Study Gap</label>
          <input type="text" {...register('studyGap')} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        {/* University name (read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">University Name</label>
          <input type="text" value={scholarshipDetails?.universityName} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        {/* Scholarship category (read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Scholarship Category</label>
          <input type="text" value={scholarshipDetails?.scholarshipCategory} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        {/* Subject Category (read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Subject Category</label>
          <input type="text" value={scholarshipDetails?.subjectCategory} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button type="submit" disabled={isSubmitting} className={`w-full bg-indigo-500 text-white py-2 px-4 rounded-md focus:outline-none focus:bg-indigo-600 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-600'}`}>
            {isSubmitting ? 'Submitting...' : 'Apply'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ScholarshipApplicationForm;

