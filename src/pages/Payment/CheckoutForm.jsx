import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const card = elements.getElement(CardElement);

    if (card === null) {
      return;
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <CardElement className="flex flex-col"
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
            disabled={!stripe}
          >
            Pay
          </button>
        </div>
      </form>
    </>
  );
};

export default CheckoutForm;
