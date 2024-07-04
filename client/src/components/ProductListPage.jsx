import algoliasearch from "algoliasearch/lite";
import {
  InstantSearch,
  SearchBox,
  Hits,
  Pagination,
  RefinementList,
  Stats,
  SortBy,
  ClearRefinements,
} from "react-instantsearch";
import "../styles/productList.css";
import { useNavigate } from "react-router-dom";
import RangeSlider from "./RangeSlider";
import LocaleContext from "./localeContextProvider";
import { useContext } from "react";


const searchClient = algoliasearch(
  "LQ3AGF58XX",
  "6d50bab0ee0616f1d5994ba0dfa920f3"
);

function truncateText(text, limit) {
  if (typeof text !== 'string') return ''; // Ensure text is a string
  const words = text.split(" ");
  if (words.length > limit) {
    return words.slice(0, limit).join(" ") + "...";
  }
  return text;
}

function Hit({ hit,locale }) {
  console.log("hit", locale)
  const navigate = useNavigate();
  const truncatedName = truncateText(hit.name[locale], 3);
  const truncatedDescription = truncateText(hit.description[locale], 7);
  const handleClick = () => {
    navigate(`/product`, { state: { hit } });
  };

  return (
    <>
      <article className="search-panel_item" onClick={handleClick}>
        <img src={hit.images} alt="images" />
        <span className="heading-secondary">{hit.productType}</span>
        <h3>{truncatedName}</h3>
        <p>{truncatedDescription}</p>
        <h3>₹ {hit.prices["INR"].max}</h3>
      </article>
    </>
  );
}

function ProductListPage() {
  const { locale } = useContext(LocaleContext);
  console.log("locale",locale)
  return (
    <>
      <div className="container">
        <InstantSearch
          searchClient={searchClient}
          indexName="Handicraft_Machathon"
          insights
        >
          <div className="search-bar-container">
            <SearchBox placeholder="Search" />
          </div>

          <div className="output-result-and-filters">
            <div className="search-panel__filters">
              <div className="filters">
                <h4>FILTERS</h4>
                <ClearRefinements
                  translations={{
                    resetButtonText: "Clear all",
                  }}
                />
              </div>

              <div className="filter_container">
                <h4>CATEGORY</h4>
                <RefinementList
                  attribute="categories.en-US.lvl0"
                  showMore
                  limit={5}
                  showMoreLimit={10}
                />
                <hr />
                <br />
                <br />
                <h4>Product Type</h4>
                <RefinementList
                  attribute="productType"
                  showMore
                  limit={5}
                  showMoreLimit={10}
                />
                <hr />
                <br />
                <br />

                <h4>Price</h4>
                <RangeSlider attribute="prices.INR.priceValues.value" />
                {/* <RangeSlider attribute="prices.INR.priceValues.value" 
                /> */}
              </div>
            </div>

            <div className="search-panel__results">
              <div className="sort-by-wrapper">
                <SortBy
                  items={[
                    { label: "Most relevant", value: "Handicraft_Machathon" },
                    {
                      label: "Lowest Price",
                      value: "Handicraft_Machathon_price_asc",
                    },
                    {
                      label: "Highest Price",
                      value: "Handicraft_Machathon_price_desc",
                    },
                  ]}
                />
              </div>
              <div className="stats">
                <Stats />
              </div>

              <div className="product-list-box">
              <Hits hitComponent={(props) => <Hit {...props} locale={locale} />} />
              </div>

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </>
  );
}
export default ProductListPage;
