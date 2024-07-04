import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "../styles/orderHistory.css";
import LocaleContext from "./localeContextProvider";
import { useNavigate } from "react-router-dom";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

const GET_CONTENT = gql`
  query GetOrderHistoryContent($locale: String!) {
    orderHistoryCollection(locale: $locale) {
      items {
        title
        emptyOrderDetails
      }
    }
  }
`;

const OrderHistoryPageContent = ({ locale }) => {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });
  const navigate = useNavigate();
  const [customerId, setCustomerId] = useState("");
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const storedCustomerId = localStorage.getItem("customer");
    if (storedCustomerId) {
      setCustomerId(storedCustomerId);
      fetchOrderHistory(storedCustomerId);
    }
  }, []);

  const fetchOrderHistory = (customerId) => {
    axios
      .get(`http://localhost:5000/orders/${customerId}`)
      .then((response) => {
        const orderData = response.data.order;
        setOrderHistory(orderData);
      })
      .catch((error) => {
        console.error("Error fetching order history:", error);
      });
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "short", year: "numeric" };
    const date = new Date(dateString).toLocaleDateString("en-GB", options);
    const timeOptions = { hour: "2-digit", minute: "2-digit", hour12: true };
    const time = new Date(dateString).toLocaleTimeString("en-US", timeOptions);
    return `${date} ${time}`;
  };

  const calculateTotal = (lineItems) => {
    return lineItems.reduce(
      (total, item) => total + item.totalPrice.centAmount,
      0
    );
  };

  const getOrderStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "ready":
        return "status-blue";
      case "cancelled":
        return "status-red";
      case "delivered":
        return "status-green";
      case "shipped":
        return "status-orange";
      default:
        return "";
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (
    !data ||
    !data.orderHistoryCollection ||
    !data.orderHistoryCollection.items.length
  ) {
    return <p>No data available</p>;
  }

  console.log("Order History: ", data.orderHistoryCollection.items[0]);
  const { title, emptyOrderDetails } = data.orderHistoryCollection.items[0];

  return (
    <div className="order-container">
      {orderHistory.length === 0 ? (
        <div className="emptyOrderContainer">
          <p>{emptyOrderDetails.emptyOrderContent}</p>
          <button onClick={() => navigate("/product-list")}>
            {emptyOrderDetails.emptyOrderBtn} &rarr;
          </button>
        </div>
      ) : (
        <div className="order-history">
          <h2>Order History</h2>
          {orderHistory.length > 0 ? (
            orderHistory.map((order, orderIndex) => (
              <div key={orderIndex} className="order-card">
                <h2>Order #{orderIndex + 1}</h2>
                <div className="order-summary">
                  <p>
                    <strong>Order ID:</strong> {order.id}
                  </p>
                  <p>
                    <strong>Total: ₹{calculateTotal(order.lineItems)}</strong>
                  </p>
                </div>
                <div className="order-details">
                  <div className="line-items">
                    {order.lineItems.length > 0 ? (
                      order.lineItems.map((lineItem, lineIndex) => (
                        <div key={lineIndex} className="line-item-card">
                          {lineItem.variant.images && (
                            <img
                              src={lineItem.variant.images[0].url}
                              alt={lineItem.name[locale]}
                              className="line-item-image"
                            />
                          )}
                          <div className="line-item-details">
                            <h3>{lineItem.name[locale]}</h3>
                            <p>Quantity: {lineItem.quantity}</p>
                            <p>Price: ₹{lineItem.totalPrice.centAmount}</p>
                          </div>
                          <div className="line-item-status">
                            <span className="ordered-on">
                              Ordered On:{" "}
                              <strong>{formatDate(order.createdAt)}</strong>
                            </span>
                            <p className="shipment-status">
                              <strong>Status: </strong>
                              <button
                                className={`shipment-status-btn ${getOrderStatusClass(
                                  order.shipmentState || "Ready"
                                )}`}
                              >
                                {order.shipmentState || "Ready"}
                              </button>
                            </p>
                            <p className="paid-status">Paid</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No line items found for this order.</p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No orders found for this customer.</p>
          )}
        </div>
      )}
    </div>
  );
};

const OrderHistoryPage = () => {
  const { locale } = useContext(LocaleContext);

  return (
    <ApolloProvider client={client}>
      <div className="orderHistoryMainContainer" locale={locale}>
        <OrderHistoryPageContent locale={locale} />
      </div>
    </ApolloProvider>
  );
};

export default OrderHistoryPage;
