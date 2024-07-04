import React, { useState } from "react";
import "../styles/shippingAddressForm.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loadStripe } from "@stripe/stripe-js";
import { ApolloProvider, gql, useQuery } from "@apollo/client";
import client from "./apolloClient";

const GET_CONTENT = gql`
  query GetAddressContent($locale: String!) {
    shippingAddressCollection(locale: $locale) {
      items {
        addressHeading
        nameDetails
        addressDetails
        deliveryDetails
      }
    }
  }
`;

function ShippingAddressFormContent({ products, locale }) {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });

  const [formData, setFormData] = useState({
    title: "",
    firstName: "",
    lastName: "",
    address: "",
    country: "IN",
    zipcode: "",
    city: "",
    state: "",
  });

  const [submittedAddress, setSubmittedAddress] = useState(null);
  const [step, setStep] = useState(0);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handlePaymentMethodChange = (e) => {
    setSelectedPaymentMethod(e.target.value);
  };
  const validateForm = () => {
    return (
      formData.title !== "" &&
      formData.firstName !== "" &&
      formData.lastName !== "" &&
      formData.address !== "" &&
      formData.country !== "" &&
      formData.zipcode !== "" &&
      formData.city !== "" &&
      formData.state !== ""
    );
  };

  const submitForm = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    try {
      // console.log(formData)
      const response = await fetch("http://localhost:5000/shipping-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("Address submitted:", result);

      if (response.ok) {
        toast.success("Address added successfully!");
        setSubmittedAddress(formData);
        setFormData({
          title: "",
          firstName: "",
          lastName: "",
          address: "",
          country: "",
          zipcode: "",
          city: "",
          state: "",
        });
        setStep(1);
      } else {
        toast.error("Failed to add address. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting address:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const handlePayment = async () => {
    if (selectedPaymentMethod === "cod") {
      toast.success("Order placed successfully!");
      window.location.href = "/order-confirm";
    } else if (selectedPaymentMethod === "card") {
      toast.info("Redirecting to Stripe Checkout...");
      await stripeCheckout();
    }
  };

  const stripeCheckout = async () => {
    const stripe = await loadStripe(
      "pk_test_51PJr9WSFTGzovtjLXAC2xrnfnHwraXlko0nqG71xR2DzyQ3vJoIPxqa7qbLRjLejsJk0AFsOXHySjQyBFmCrVeQe00MbUJjkkS"
    );
    const body = {
      carts: products,
    };
    const headers = {
      "Content-Type": "application/json",
    };
    const response = await fetch(
      "http://localhost:5000/api/create-checkout-session",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();

    const result = stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) {
      console.log(result.error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (
    !data ||
    !data.shippingAddressCollection ||
    !data.shippingAddressCollection.items.length
  ) {
    return <p>No data available</p>;
  }

  // console.log(data.shippingAddressCollection.items[0]);

  const { addressHeading, addressDetails, deliveryDetails, nameDetails } =
  data.shippingAddressCollection.items[0];
  console.log(deliveryDetails);

  return (
    <>
      {step === 0 && (
        <div className="address-container">
          <p>{addressHeading}</p>
          <hr />
          <div className="form">
            <div className="fields fields--2">
              <label className="field">
                <p className="field__label" htmlFor="title">
                  {nameDetails.salutation}
                </p>
                <select
                  className="field__input"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                >
                  <option value="">{nameDetails.choose}</option>
                  <option value="Mr">{nameDetails.mr}</option>
                  <option value="Mrs">{nameDetails.mrs}</option>
                  <option value="Ms">{nameDetails.ms}</option>
                </select>
              </label>
              <label className="field">
                <p className="field__label" htmlFor="firstName">
                  {nameDetails.firstName}
                </p>
                <input
                  className="field__input"
                  type="text"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  placeholder={nameDetails.firstNamePlaceholder}
                />
              </label>
              <label className="field">
                <p className="field__label" htmlFor="lastName">
                  {nameDetails.lastName}
                </p>
                <input
                  className="field__input"
                  type="text"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  placeholder={nameDetails.lastNamePlaceholder}
                />
              </label>
            </div>
            <label className="field">
              <p className="field__label" htmlFor="address">
                {addressDetails.address}
              </p>
              <input
                className="field__input"
                type="text"
                id="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder={addressDetails.addressPlaceHolder}
              />
            </label>
            <label className="field">
              <p className="field__label" htmlFor="country">
                {addressDetails.country}
              </p>
              <select
                className="field__input"
                id="country"
                value={formData.country}
                onChange={handleChange}
                required
              >
                <option value="">{addressDetails.chooseCountry}</option>
                <option value="IN">{addressDetails.india}</option>
              </select>
            </label>
            <div className="fields fields--3">
              <label className="field">
                <p className="field__label" htmlFor="city">
                  {addressDetails.city}
                </p>
                <input
                  className="field__input"
                  type="text"
                  id="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  placeholder={addressDetails.cityPlaceHolder}
                />
              </label>
              <label className="field">
                <p className="field__label" htmlFor="state">
                  {addressDetails.state}
                </p>
                <select
                  className="field__input"
                  id="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                >
                  <option value="">{addressDetails.chooseState}</option>
                  <option value="karnataka">{addressDetails.karnataka}</option>
                </select>
              </label>
              <label className="field">
                <p className="field__label" htmlFor="zipcode">
                  {addressDetails.zipCode}
                </p>
                <input
                  className="field__input"
                  type="text"
                  id="zipcode"
                  value={formData.zipcode}
                  onChange={handleChange}
                  required
                  placeholder={addressDetails.zipCodePlaceHolder}
                />
              </label>
            </div>
            <button className="button" onClick={submitForm}>
              {addressDetails.continueBtn}
            </button>
          </div>
        </div>
      )}
      <ToastContainer />

      {step === 1 && (
        <div className="payment-container">
          <div className="submitted-address">
            <h3>{deliveryDetails.deliveryDetail}</h3>
            <h2>
              {submittedAddress.title} {submittedAddress.firstName}{" "}
              {submittedAddress.lastName}
            </h2>
            <p>{submittedAddress.address}</p>
            <p>
              {submittedAddress.city}, {submittedAddress.state} --{" "}
              {submittedAddress.zipcode}
            </p>
            <p>{deliveryDetails.countryName}</p>
            <li>{deliveryDetails.paymentText}</li>
          </div>
          <div className="payment-methods">
            <h3>{deliveryDetails.paymentMethods}</h3>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                onChange={handlePaymentMethodChange}
              />
              &nbsp;{deliveryDetails.codPayment}
            </label>
            <label>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                onChange={handlePaymentMethodChange}
                defaultChecked
              />
              &nbsp;{deliveryDetails.cardPayment}
              <img src="card.png" alt="Visa" className="card-logo" />
            </label>
            <button className="btn" onClick={handlePayment}>
              {selectedPaymentMethod === "cod" ? deliveryDetails.placeOrder : deliveryDetails.payNow}
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const ShippingAddressForm = ({ locale, products }) => {
  return (
    <ApolloProvider client={client}>
      <ShippingAddressFormContent products={products} locale={locale} />
    </ApolloProvider>
  );
};

export default ShippingAddressForm;
