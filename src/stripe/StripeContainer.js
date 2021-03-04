import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { CheckoutForm } from "./CheckoutForm";

const PUBLIC_KEY =
  "pk_test_51IN7guArn0UDnj9cCz5y2A4HG4urpmgO5h5BxCwN8dZc4eKVyvMRxbkhE789EJf1aiGAN66oyy788yyZ4Npl26Lt00kNVqkViL";

const stripeTestPromise = loadStripe(PUBLIC_KEY);

const Stripe = () => {
  return (
    <Elements stripe={stripeTestPromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default Stripe;
