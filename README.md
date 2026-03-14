# Typesense Search Implementation

A comprehensive implementation of [Typesense](https://typesense.org/) in Node.js, covering everything from basic indexing to advanced search features like synonyms, overrides, and collection aliases.

## 🚀 Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop/)
- [Node.js](https://nodejs.org/) (v14+)

### 1. Run Typesense Server

Use Docker to start the Typesense server locally. The following command sets up the server on port `8108` with the API key `xyz` (as configured in `index.js`).

```bash
docker run -p 8108:8108 -v /tmp/typesense-data:/data \
typesense/typesense:27.1 \
--data-dir /data \
--api-key=xyz \
--enable-cors
```

### 2. Install Dependencies

Clone the repository and install the required npm packages:

```bash
npm install
```

### 3. Run the Application

Execute the script to setup the collection, index data, and perform sample searches:

```bash
node index.js
```

## ✨ Features Covered

This project demonstrates several core Typesense capabilities:

- **Schema Definition**: Creating structured collections with multi-field indexing and faceting.
- **Indexing**: Importing documents into Typesense collections.
- **Advanced Search**: 
    - Searching across multiple fields (`title`, `description`).
    - Dynamic faceting by `brand` and `category`.
    - Typo tolerance (handles "laptop" typos automatically).
- **Relevance Tuning**:
    - **Synonyms**: Linking related terms (e.g., "kicks" -> "shoes").
    - **Overrides**: Promoting specific documents (e.g., forcing a MacBook to the top for "laptop" queries).
- **Collection Aliases**: Implementing zero-downtime deployments by pointing a "live" alias to specific collection versions.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Search Engine**: Typesense
- **Client Library**: `typesense-js`

---

*Built to explore high-performance, low-latency search solutions.*
