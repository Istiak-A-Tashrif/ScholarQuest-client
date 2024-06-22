import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import CheckoutForm from "./CheckoutForm";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_PK);

const Payment = () => {
  const location = useLocation();
  const state = location.state || {};
  const { fee } = state;

  return (
    <>
      <Elements stripe={stripePromise}>
        <CheckoutForm fee={fee}></CheckoutForm>
      </Elements>
    </>
  );
};

export default Payment;
