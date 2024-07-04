import React, { useContext } from "react";
import "../styles/footer.css";
import { useQuery, gql, ApolloProvider } from "@apollo/client";
import client from "./apolloClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import LocaleContext from "./localeContextProvider";

const GET_CONTENT = gql`
  query GetFooterContent($locale: String!) {
    footerCollection(locale: $locale) {
      items {
        footerHeading
        socialMedia
      }
    }
  }
`;

const FooterContent = ({ locale }) => {
  const { loading, error, data } = useQuery(GET_CONTENT, {
    variables: { locale },
  });
  console.log(data);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  if (!data || !data.footerCollection || !data.footerCollection.items.length) {
    return <p>No data available</p>;
  }

  const { footerHeading, socialMedia } = data.footerCollection.items[0];

  return (
    <div className="footerContent">
      <div className="section1">
        &copy; {footerHeading}
      </div>
      <div className="section2">
        <p>{socialMedia}</p>
        <div className="socialIcons">
          <FontAwesomeIcon className="icons" icon={faFacebook} />
          <FontAwesomeIcon className="icons" icon={faInstagram} />
          <FontAwesomeIcon className="icons" icon={faTwitter} />
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  const { locale } = useContext(LocaleContext);

  return (
    <ApolloProvider client={client}>
      <div className="footerMainContainer">
        <FooterContent locale={locale} />
        {/* <div className="languageSwitcher">
          <select
            name="selectlanguage"
            id="selectlanguage"
            onChange={(event) => setLocale(event.target.value)}
          >
            <option value="en-US">English</option>
            <option value="hi-IN">Hindi</option>
          </select>
        </div> */}
      </div>
    </ApolloProvider>
  );
};

export default Footer;
