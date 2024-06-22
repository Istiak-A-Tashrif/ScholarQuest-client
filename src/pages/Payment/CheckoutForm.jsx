import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";
import useAuth from "../../Hooks/useAuth";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ fee, universityName, scholarshipId, scholarshipDetails }) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState();
  const {user} = useAuth();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    axios
      .post("http://localhost:5000/create-payment-intent", { price: fee })
      .then((res) => {
        setClientSecret(res.data.clientSecret);
      });
  }, [fee]);

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
      console.log("payment error", error);
      setError(error.message)
    } else {
      console.log("paymentMethod", paymentMethod);
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
      console.log(confirmError);
      setError(confirmError.message)
    }
    else{
      console.log(paymentIntent);
      setError('')
      if (paymentIntent.status === 'succeeded') {
        Swal.fire({
          title: "Success!",
          text: "Your payment was successful",
          icon: "success"
        });
        const payment = {
          email: user.email,
          price: fee,
          transactionId: paymentIntent.id,
          date: new Date(),
          universityName: universityName,
          scholarshipId: scholarshipId,
        }
  
        const res = await axios.post("http://localhost:5000/savePayment", payment)
        console.log('payment saved', res);
        
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
