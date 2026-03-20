
import React from 'react';
import { InstantSearch, SearchBox, Hits, RefinementList, Pagination } from 'react-instantsearch';
import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';
import 'instantsearch.css/themes/satellite.css';

const typesenseAdapter = new TypesenseInstantSearchAdapter({
  server: {
    apiKey: import.meta.env.VITE_TYPESENSE_API_KEY,
    nodes: [
      {
        host: import.meta.env.VITE_TYPESENSE_HOST,
        port: import.meta.env.VITE_TYPESENSE_PORT,
        protocol: import.meta.env.VITE_TYPESENSE_PROTOCOL
      }
    ],
  },
  additionalSearchParameters: {
    query_by: 'title,description', // Tell it where to look
    query_by_weight: '3,1'
  },
});
const searchClient = typesenseAdapter.searchClient;

// --- 2. CUSTOM HIT COMPONENT (How one product looks) ---
// React passes the matching data into this component via the 'hit' prop
const ProductCard = ({ hit }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', borderRadius: '8px' }}>
      <h3>{hit.title}</h3>
      <p>{hit.description}</p>
      <p><strong>Brand:</strong> {hit.brand}</p>
      <p><strong>Price:</strong> ${hit.price}</p>
    </div>
  );
};

// --- 3. THE MAIN APP (The UI) ---
export default function App() {
  return (
    // <InstantSearch> wraps your app so all components share the Typesense data
    <InstantSearch searchClient={searchClient} indexName="products_live">

      <div style={{ display: 'flex', gap: '20px', padding: '20px' }}>

        {/* LEFT SIDEBAR: The Facets */}
        <div style={{ width: '250px' }}>
          <h2>Brands</h2>
          <RefinementList attribute="brand" />

          <h2>Categories</h2>
          <RefinementList attribute="category" />
        </div>

        {/* RIGHT SIDE: The Search Bar & Results */}
        <div style={{ flex: 1 }}>
          {/* This one input handles typing, prefix/autocomplete, and sending the query! */}
          <SearchBox placeholder="Search for laptops, shoes..." />

          <br />

          {/* This loops through your results and renders your ProductCard for each one */}
          <Hits hitComponent={ProductCard} />

          <br />
          <Pagination />
        </div>

      </div>

    </InstantSearch>
  );
}