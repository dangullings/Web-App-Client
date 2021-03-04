import React from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

import {
  Typography,
  Popconfirm,
  Modal,
  Row,
  Select,
  Divider,
  Space,
  message,
  Image,
  Checkbox,
  notification,
  Col,
  Button,
  Card,
  Form,
} from "antd";
import { chargePayment } from "../util/APIUtils";

export const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    console.log("handle submit");
    event.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      console.log("Stripe 23 | token generated!", paymentMethod);
      chargePayment(paymentMethod);
    } else {
      console.log(error.message);
    }
  };

  return (
    <Form onFinish={handleSubmit} ref={this.formRef}>
      <CardElement />
      <Button
        key="submit"
        type="primary"
        size="large"
        onClick={handleSubmit}
        style={{
          borderRadius: "6px",
          marginTop: "10px",
          width: "100%",
        }}
      >
        Pay
      </Button>
    </Form>
  );
};
