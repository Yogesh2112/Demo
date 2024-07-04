import React, { useState, useContext } from "react";
import "../styles/signupPage.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import LocaleContext from "./localeContextProvider";

const GET_CONTENT = gql`
  query GetSignUpContent($locale: String!) {
    signUpCollection(locale: $locale) {
      items {
        logo
        signUp
        signUpDescription
        signUpData
      }
    }
  }
`;

const SignupContent = ({ locale }) => {
  const navigate = useNavigate();
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.signUpCollection || !data.signUpCollection.items.length) {
    return <p>No data available</p>;
  }

  const { logo, signUp, signUpDescription, signUpData } =
    data.signUpCollection.items[0];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const isValidEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const isValidPassword = (password) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{10,}$/;
    return passwordRegex.test(password);
  };

  const validateField = (field) => {
    const errors = {};

    switch (field) {
      case "firstName":
        if (!formData[field].trim()) {
          errors[field] = "First Name is required";
        }
        break;
      case "lastName":
        if (!formData[field].trim()) {
          errors[field] = "Last Name is required";
        }
        break;
      case "email":
        if (!formData[field].trim()) {
          errors[field] = "Email is required";
        } else if (!isValidEmail(formData[field])) {
          errors[field] = "Invalid email format";
        }
        break;
      case "password":
        if (!formData[field].trim()) {
          errors[field] = "Password is required";
        } else if (formData[field].length < 10) {
          errors[field] = "Password must be at least 10 characters";
        } else if (!isValidPassword(formData[field])) {
          errors[field] =
            "Must contain alphabets, number and special characters.";
        }
        break;
      case "confirmPassword":
        if (!formData[field].trim() || formData.password !== formData[field]) {
          errors[field] = "Passwords do not match";
        }
        break;
      default:
        break;
    }
    return errors;
  };

  const handleBlur = (field) => {
    const errors = validateField(field);
    setFormErrors((prevErrors) => ({
      ...prevErrors,
      [field]: errors[field],
    }));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const errorData = {
      firstName: !formData.firstName,
      lastName: !formData.lastName,
      email: !isValidEmail(formData.email),
      password: !formData.password,
      confirmPassword: formData.confirmPassword !== formData.password,
    };

    setFormErrors(errorData);

    if (Object.values(errorData).some((error) => error)) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/customers",
        formData
      );
      console.log(response);
      alert("Success");
    } catch (error) {
      console.error("Registration process failed");
      console.error(error);
      alert("Failed");
    }
  };

  return (
    <div className="signupPage">
      <div className="sections">
        <div className="section1">
          <img src={logo[0].url} alt="logo" />
          <h3>{signUp}</h3>
          <p>{signUpDescription}</p>
        </div>
        <div className="section2">
          <div className="fullNameContainer">
            <input
              className={formErrors.firstName ? "inputError" : ""}
              name="firstName"
              type="text"
              placeholder={signUpData.firstnamePlaceholder}
              value={formData.firstName}
              onChange={handleChange}
              onBlur={() => handleBlur("firstName")}
            />
            <input
              className={formErrors.lastName ? "inputError" : ""}
              name="lastName"
              type="text"
              placeholder={signUpData.lastnamePlaceholder}
              value={formData.lastName}
              onChange={handleChange}
              onBlur={() => handleBlur("lastName")}
            />
          </div>
          <input
            className={formErrors.email ? "inputError" : ""}
            name="email"
            type="email"
            placeholder={signUpData.emailPlaceholder}
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
          />
          <input
            className={formErrors.password ? "inputError" : ""}
            name="password"
            type="password"
            value={formData.password}
            placeholder={signUpData.passwordPlaceholder}
            onChange={handleChange}
            onBlur={() => handleBlur("password")}
          />
          <div className="confirmPasswordInputContainer">
            <input
              className={formErrors.confirmPassword ? "inputError" : ""}
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder={signUpData.confirmPasswordPlaceholder}
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur("confirmPassword")}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEye : faEyeSlash}
              className="passwordToggleIcon"
              onClick={() => setShowPassword(!showPassword)}
            />
          </div>
          <div className="signupScreenButtons">
            <button
              className="alreadyregisteredBtn"
              onClick={() => navigate("/")}
            >
              {signUpData.alreadyHaveAccount}
            </button>
            <button className="cancelBtn" onClick={() => navigate("/")}>
              {signUpData.cancelBtn}
            </button>
            <button className="signupBtn" onClick={handleSignUp}>
              {signUpData.signupBtn}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignupPage = () => {
  const { locale } = useContext(LocaleContext);

  return (
    <ApolloProvider client={client}>
      <div className="signupMainContainer">
        <SignupContent locale={locale} />
      </div>
    </ApolloProvider>
  );
};

export default SignupPage;
