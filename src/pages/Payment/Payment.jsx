import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";
import CheckoutForm from "./CheckoutForm";
import { useLocation } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_PK);

const Payment = () => {
  const location = useLocation();
  const state = location.state || {};
  const { fee, universityName, scholarshipId, scholarshipDetails } = state;

  return (
    <>
      <Elements stripe={stripePromise}>
        <CheckoutForm fee={fee} universityName={universityName} scholarshipId={scholarshipId} scholarshipDetails={scholarshipDetails}></CheckoutForm>
      </Elements>
    </>
  );
};

export default Payment;
