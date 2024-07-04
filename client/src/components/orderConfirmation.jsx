import axios from "axios";
import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/orderConfirmation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import LocaleContext from "./localeContextProvider";

const GET_CONTENT = gql`
  query GetOrderConfirmationContent($locale: String!) {
    orderConfirmationCollection(locale: $locale) {
      items {
        heading
        subTexts
        buttons
      }
    }
  }
`;

const OrderConfirmationContent = ({ locale }) => {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });
  const navigate = useNavigate();

  const fetchCartDetails = async () => {
    try {
      const customerId = localStorage.getItem("customer");
      const cartResponse = await axios.get(
        `http://localhost:5000/carts?customerId=${customerId}`
      );

      if (cartResponse.status !== 200) {
        throw new Error("Failed to fetch cart details");
      }

      const cartDetails = cartResponse.data;

      console.log("Cart details fetched:", cartDetails);
    } catch (error) {
      console.error("Error fetching cart details:", error);
    }
  };

  const placeOrder = async () => {
    try {
      const orderResponse = await axios.post(
        "http://localhost:5000/create-order"
      );

      if (orderResponse.status !== 200) {
        throw new Error("Failed to place order");
      }

      const orderData = orderResponse.data;
      console.log("Order placed successfully:", orderData);
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  const deleteCart = async () => {
    try {
      const response = await fetch("http://localhost:5000/carts", {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete cart");
      }
      const data = await response.json();
      console.log("Cart deletion response:", data);
    } catch (error) {
      console.error("Error deleting cart:", error);
    }
  };

  useEffect(() => {
    const processOrder = async () => {
      try {
        await fetchCartDetails();
        await placeOrder();
        console.log("Order placed, now fetching cart details again...");
        await fetchCartDetails();
        console.log("Cart details fetched again, now deleting cart...");
        await deleteCart();
        console.log("Cart deleted .");
      } catch (error) {
        console.error("Error in processOrder:", error);
      }
    };
    processOrder();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (
    !data ||
    !data.orderConfirmationCollection ||
    !data.orderConfirmationCollection.items.length
  ) {
    return <p>No data available</p>;
  }

  const { heading, subTexts, buttons } =
    data.orderConfirmationCollection.items[0];

  return (
    <>
      <div className="orderConfirmationContainer">
        <div className="orderConfirmationContent">
          <span>
            <FontAwesomeIcon className="fa-icon" icon={faCheckCircle} />
            <h1>{heading}</h1>
          </span>

          <div className="orderContent">
            <div className="confirmationHeading">
              <h2>{subTexts.subtext1}</h2>
            </div>

            <p className="updateTextMessage">{subTexts.subtext2}</p>
            <div className="orderButtons">
              <button onClick={() => navigate("/order-history")}>
                {buttons.order}
              </button>
              <button onClick={() => navigate("/product-list")}>
                {buttons.shop}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const OrderConfirmation = () => {
  const { locale } = useContext(LocaleContext);
  return (
    <ApolloProvider client={client}>
      <OrderConfirmationContent locale={locale} />
    </ApolloProvider>
  );
};

export default OrderConfirmation;
