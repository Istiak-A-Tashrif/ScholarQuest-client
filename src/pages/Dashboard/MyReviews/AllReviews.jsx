import { useEffect, useState } from 'react';
import useAuth from '../../../Hooks/useAuth';
import axios from 'axios';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MdDelete } from 'react-icons/md';
import Swal from 'sweetalert2';
import Lottie from 'lottie-react';
import loading from "../../../assets/loading.json";

const AllReviews = () => {
  const [userRole, setUserRole] = useState(null);
  const { user } = useAuth();
  const queryClient  = useQueryClient()

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await axios.post(`${import.meta.env.VITE_URL}/checkUserRole`, { email: user?.email });
        setUserRole(response.data.role);
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    if (user?.email) {
      fetchUserRole();
    }
  }, [user]);

  const { data, isLoading, isError, error } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(`${import.meta.env.VITE_URL}/allReviews`);
      return data;
    },
    queryKey: ["allReviews"],
    enabled: userRole === 'admin' || userRole === 'moderator', // Only fetch if the user has the appropriate role
  });

  if (userRole !== 'admin' && userRole !== 'moderator') {
    return <div>You do not have permission to view this page.</div>;
  }

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

  const handleDelete = async (reviewId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${import.meta.env.VITE_URL}/deleteReview/${reviewId}`);
          Swal.fire("Deleted!", "Your review has been deleted.", "success");
          queryClient.invalidateQueries("myReviews");
        } catch (error) {
          console.error("Error deleting review:", error);
          Swal.fire("Error", "Failed to delete review. Please try again later.", "error");
        }
      }
    });
  };
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            <th></th>
            <th>
              University Name
            </th>
            <th>Scholar Category</th>
            <th>Review Date</th>
            <th>Rating</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((review, index) => (
            <tr key={index}>
                <td><button className='hover:scale-[2]' onClick={() => handleDelete(review._id)}><MdDelete className='text-lg'></MdDelete></button></td>
              <td>
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="mask mask-squircle h-12 w-12">
                      <img src={review.reviewerImage} alt={review.reviewerName} />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">{review.reviewerName}</div>
                  </div>
                </div>
              </td>
              <td>
                {review.universityName}
              </td>
              <td>{review.scholarshipName}</td>
              <td>
                {review.ratingPoint}
              </td>
              <td>{review.comments}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllReviews;
