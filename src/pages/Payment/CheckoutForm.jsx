import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import { useEffect, useState } from "react";

const CheckoutForm = ({ fee }) => {
  const [error, setError] = useState("");
  const [clientSecret, setClientSecret] = useState();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    axios
      .post("http://localhost:5000/create-payment-intent", { price: fee })
      .then((res) => {
        console.log(res.data.clientSecret);
        setClientSecret(res.data.clientSecret);
      });
  }, [fee]);
  console.log(clientSecret);

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
    } else {
      console.log("paymentMethod", paymentMethod);
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
        <div className="flex items-center justify-center">
          <button
            className="btn btn-info my-4"
            type="submit"
            disabled={!stripe || !clientSecret}
          >
            Pay
          </button>
        </div>
        <p className="text-red-500"></p>
      </form>
    </>
  );
};

export default CheckoutForm;
