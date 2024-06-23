import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { MdDeleteForever } from "react-icons/md";
import useAuth from "../../../Hooks/useAuth";
import formatDateToDdmmyyyy from "../../../Utility/formatDateToDdmmyyyy";

const MyReviews = () => {
    const { user } = useAuth();
    const {
        data: reviews = [],
        isLoading,
        isError,
        error,
      } = useQuery({
        queryFn: async () => {
          const { data } = await axios(
            `${import.meta.env.VITE_URL}/myReviews?email=${user.email}`
          );
          return data;
        },
        queryKey: ["myReviews"],
      });
  return (
    <>
      <div className="overflow-x-auto">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>University Name</th>
              <th>Scholarship Name</th>
              <th>Review Romments</th>
              <th>Review Date</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
           {
            reviews.map((review, idx) => {
                return  <tr key={idx} className="hover">
                <th>{idx+1}</th>
                <td>{review.universityName}</td>
                <td>{review.scholarshipName}</td>
                <td>{review.comments}</td>
                <td>{formatDateToDdmmyyyy(review.reviewDate)}</td>
                <td>
                  <FaEdit  className="hover:scale-[2]" />
                </td>
                <td>
                  <MdDeleteForever  className="hover:scale-[2]" />
                </td>
              </tr>
            })
           }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default MyReviews;
