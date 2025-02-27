import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/UseAxiosSecure";

const CheckoutForm = ({ fee, universityName, scholarshipId, scholarshipDetails }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState();
  const {user} = useAuth();
  const axiosSecure = useAxiosSecure();
  const stripe = useStripe();
  const elements = useElements();
  const totalPrice = fee + scholarshipDetails.serviceCharge

  useEffect(() => {
    axios
      .post(`${import.meta.env.VITE_URL}/create-payment-intent`, { price: totalPrice })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      });
  }, [totalPrice]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card === null) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      console.error("payment error", error);
      setError(error.message)
    } else {
      setError('')
    }
    const {paymentIntent, error: confirmError} = await stripe.confirmCardPayment(clientSecret, {
    payment_method: {
        card: card,
        billing_details: {
          email: user?.email || 'anonymous',
          name: user?.displayName || 'anonymous'
        }
      }
    })
    if (confirmError) {
      console.error(confirmError);
      setError(confirmError.message)
    }
    else{
      setError('')
      if (paymentIntent.status === 'succeeded') {
        Swal.fire({
          title: "Success!",
          text: "Your payment was successful",
          icon: "success"
        });
        const payment = {
          email: user.email,
          price: totalPrice,
          transactionId: paymentIntent.id,
          date: new Date(),
          universityName: universityName,
          scholarshipId: scholarshipId,
        }
  
        const res = await axiosSecure.post(`/savePayment?email=${user.email}`, payment)
        
        navigate('/apply', { state: { scholarshipDetails: scholarshipDetails } });
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement
          className="w-1/2 mx-auto"
          options={{
            style: {
              base: {
                fontSize: "16px",
                color: "#424770",
                "::placeholder": {
                  color: "#aab7c4",
                },
              },
              invalid: {
                color: "#9e2146",
              },
            },
          }}
        />
        <div className="flex items-center justify-center flex-col">
          <button
            className="btn btn-info my-4"
            type="submit"
            disabled={!stripe || !clientSecret}
          >
            Pay
          </button>
        <p className="text-red-500">{error}</p>
        </div>
      </form>
    </>
  );
};

export default CheckoutForm;
