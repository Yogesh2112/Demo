import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/shoppingCart.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import ShippingAddressForm from "./ShippingAddressForm";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LocaleContext from "./localeContextProvider";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";

const GET_CONTENT = gql`
  query GetShoppingCartContent($locale: String!) {
    shoppingCartCollection(locale: $locale) {
      items {
        title
        emptyCartContent
        cartDetails
        orderSummary
      }
    }
  }
`;

function ShoppingCartContent({ locale }) {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });
  const navigate = useNavigate();

  const customerId = localStorage.getItem("customer");
  const [products, setProducts] = useState([]);
  const [showShippingAddress, setShowShippingAddress] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [refresh, setRefresh] = useState("false");
  const shippingAddressRef = useRef(null);

  useEffect(() => {
    const getAllEntries = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/carts?customerId=${customerId}`
        );
        const productsInCart = response.data.lineItems;
        const updatedProducts = productsInCart.map((item) => {
          const lineItemId = item.id;
          const productId = item.productId;
          const productName = item.name[locale];
          const productPrice = item.price.value.centAmount;
          const productImage = item.variant.images[0]?.url;
          const quantity = item.quantity;

          // Extracting attributes
          const attributes = {};
          item.variant.attributes.forEach((attr) => {
            attributes[attr.name] = attr.value[locale];
          });

          const {
            Color: color = "N/A",
            Size: size = "N/A",
            Material: material = "N/A",
          } = attributes;

          return {
            lineItemId: lineItemId,
            id: productId,
            name: productName,
            price: productPrice,
            imageUrl: productImage,
            quantity: quantity,
            color: color,
            size: size,
            material: material,
          };
        });

        setProducts(updatedProducts);

        // Calculate total number of items in cart
        const productsCart = response.data.lineItems;

        // Extract unique product IDs
        const uniqueProductIds = [
          ...new Set(productsCart.map((item) => item.productId)),
        ];
        setTotalItems(uniqueProductIds.length);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    if (customerId) {
      getAllEntries();
    }
  }, [customerId, locale, refresh]);

  const calculateSubtotal = () => {
    return products.reduce(
      (sum, product) => sum + product.price * product.quantity,
      0
    );
  };

  const toggleShippingAddress = () => {
    setShowShippingAddress((prev) => !prev);
  };

  const handleCheckout = () => {
    console.log("checkout click", showShippingAddress);
    if (!showShippingAddress) {
      setShowShippingAddress(true);
      console.log("after change", showShippingAddress);
      setTimeout(() => {
        shippingAddressRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 100);
    }
  };

    const handleRemoveItem = async (id) => {
    try {
      const response = await axios.post(`http://localhost:5000/removecart`, {
        id,
        customerId,
      });
      console.log("frontend", response);
      setRefresh((prev) => !prev);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (
    !data ||
    !data.shoppingCartCollection ||
    !data.shoppingCartCollection.items.length
  ) {
    return <p>No data available</p>;
  }

  const { title, emptyCartContent, cartDetails, orderSummary } = data.shoppingCartCollection.items[0];
  const { emptyCartHeading, emptyCartButton } = emptyCartContent;
  
  console.log( cartDetails);
  console.log("product data",products)
  
  return (
    <div className="cartContent">
      {/* <div className="shopping-cart-title"></div> */}
      {products.length === 0 ? (
        <div className="emptyCartContainer">
          <p>{emptyCartHeading}</p>
          <button onClick={() => navigate("/product-list")}>
            {emptyCartButton} &rarr;
          </button>
        </div>
      ) : (
        <>
          <div className="shopping-cart">
            <section className="itemsInCart">
              <h1>{title}</h1>
              <div className="column-labels">
                <label className="product-image">{cartDetails.imageLabel}</label>
                <label className="product-details">{cartDetails.productLabel}</label>
                <label className="product-price">{cartDetails.priceLabel}</label>
                <label className="product-quantity">{cartDetails.quantityLabel}</label>
                <label className="product-line-price">{cartDetails.totalLabel}</label>
              </div>

              {products.map((product) => (
                <div className="product" key={product.id}>
                  <div className="product-image">
                    <img src={product.imageUrl} alt={product.name} />
                  </div>
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p>{cartDetails.productColor}: {product.color}</p>
                    <p>{cartDetails.productSize}: {product.size}</p>
                    <p>{cartDetails.productMaterial}: {product.material}</p>
                  </div>
                  <div className="product-price">{product.price}</div>
                  <div className="product-quantity">
                    <span>{product.quantity}</span>
                  </div>
                  <div className="product-line-price">
                    {(product.price * product.quantity).toFixed(2)}
                  <button
                    className="remove-product"
                    onClick={() => handleRemoveItem(product.lineItemId)}
                  >
                    {cartDetails.removeBtn}
                  </button>
                  </div>
                  </div>
                
              ))}
            </section>

            <section className="summary">
              <h1>{orderSummary.summaryHeading}</h1>
              <div className="totals">
                <div className="totals-item">
                  <label>{orderSummary.totalItems}</label>
                  <div className="totals-item-value">{totalItems}</div>
                </div>
                <div className="totals-item">
                  <label>{orderSummary.subTotal}</label>
                  <div className="totals-value">{calculateSubtotal()}</div>
                </div>
                <div className="totals-item">
                  <label>{orderSummary.tax}</label>
                  <div className="totals-value">0</div>
                </div>
                <div className="totals-item">
                  <label>{orderSummary.shipping}</label>
                  <div className="totals-value">0</div>
                </div>
                <div className="totals-item totals-item-total">
                  <label>{orderSummary.grandTotal}</label>
                  <div className="totals-value">{calculateSubtotal()}</div>
                </div>
              </div>
              <button className="checkout" onClick={handleCheckout}>
                {orderSummary.checkout}
              </button>
              <button
                className=" backButton"
                onClick={() => navigate("/product-list")}
              >
                <FontAwesomeIcon icon={faArrowLeft} /> {orderSummary.continueShop}
              </button>
            </section>
          </div>

          <div className="shipping-address" ref={shippingAddressRef}>
            <button className="toggle-address" onClick={toggleShippingAddress}>
              {orderSummary.shippingAddress} <FontAwesomeIcon icon={faAngleDown} />
            </button>

            {showShippingAddress && <ShippingAddressForm products={products} locale={locale}/>}
          </div>
        </>
      )}
      <ToastContainer />
    </div>
  );
}

const ShoppingCart = () => {
  const { locale } = useContext(LocaleContext);
  return (
    <ApolloProvider client={client}>
      <div className="cartMainContainer">
        <ShoppingCartContent locale={locale} />
      </div>
    </ApolloProvider>
  );
};

export default ShoppingCart;
