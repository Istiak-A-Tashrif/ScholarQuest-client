import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import formatDateToDdmmyyyy from "../../Utility/formatDateToDdmmyyyy";
import Lottie from "lottie-react";
import loading from "../../assets/loading.json";

const PaymentHistory = () => {
    const {user} = useAuth();
  const {
    data: payments = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios(
        `${import.meta.env.VITE_URL}/paymentHistory?email=${user.email}`
      );
      return data;
    },
    queryKey: ["payments"],
  });

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
        {/* head */}
        <thead>
          <tr>
            <th></th>
            <th>University Name</th>
            <th>Fee</th>
            <th>Transaction ID</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {/* row 2 */}
          {payments.map((payment, idx) => {
            return (
              <tr key={idx} className="hover">
                <th>{idx + 1}</th>
                <td>{payment.universityName}</td>
                <td>{payment.price}</td>
                <td>{payment.transactionId}</td>
                <td>{formatDateToDdmmyyyy(payment.date)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>
    </>
  );
};

export default PaymentHistory;
