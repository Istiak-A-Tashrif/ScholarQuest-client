import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useQuery } from '@tanstack/react-query';
import useAuth from '../../../Hooks/useAuth';
import { useParams } from 'react-router-dom';
import Lottie from 'lottie-react';
import loading from "../../../assets/loading.json";
import useAxiosSecure from '../../../Hooks/UseAxiosSecure';

const EditApplicationForm = () => {
  const axiosSecure = useAxiosSecure();
  const { handleSubmit, register, setValue, formState: { errors }, setError } = useForm();
  const { id } = useParams();
  const { user } = useAuth();
  const { data: applicationData = [], isLoading, isError, error } = useQuery({
    queryFn: async () => {
      const { data } = await axiosSecure(
        `/editApplication?id=${id}&email=${user.email}`
      );
      return data;
    },
    queryKey: ["editApplication"],
  });
   
  // Initialize form with existing application data
  useEffect(() => {
    if (applicationData) {
      setValue('phoneNumber', applicationData.phoneNumber);
      setValue('address', applicationData.address);
      setValue('gender', applicationData.gender);
      setValue('degree', applicationData.degree);
      setValue('sscResult', applicationData.sscResult);
      setValue('hscResult', applicationData.hscResult);
      setValue('studyGap', applicationData.studyGap);
      // You can set other fields similarly
    }
  }, [applicationData, setValue]);

  const submitForm = async (formData) => {
    try {
      // Submit the form data
     const res = await axiosSecure.put(`/updateScholarApply/${applicationData._id}?email=${user.email}`, formData);
      // Show success message
      if (res.data.application) {
        Swal.fire({
            title: "Success",
            text: "Application updated successfully",
            icon: "success"
          });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      // Show error message
      Swal.fire({
        title: "Error",
        text: "Cannot update the application right now.",
        icon: "error"
      });
    }
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
    <div className="max-w-lg mx-auto mt-8 bg-white p-6 rounded shadow-lg mb-6">
      <form onSubmit={handleSubmit(submitForm)}>
        {/* Applicant phone number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input type="number" {...register('phoneNumber', { required: true })} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          {errors.phoneNumber && <span className="text-red-500 text-sm">This field is required</span>}
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
          <input type="text" value={applicationData?.scholarshipDetails?.universityName} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        {/* Scholarship category (read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Scholarship Category</label>
          <input type="text" value={applicationData?.scholarshipDetails?.scholarshipCategory} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        {/* Subject Category (read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Subject Category</label>
          <input type="text" value={applicationData?.scholarshipDetails?.subjectCategory} readOnly className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:bg-indigo-600">Update Application</button>
        </div>
      </form>
    </div>
  );
};

export default EditApplicationForm;
