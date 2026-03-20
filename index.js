require("dotenv").config()
const Typesense = require('typesense');

// 1. Create a client to connect to the Typesense server
const client = new Typesense.Client({
    nodes: [{
        host: process.env.HOST,
        port: process.env.PORT,
        protocol: process.env.PROTOCOL
    }],
    apiKey: process.env.API_KEY, // The same key we used in the Docker command
    connectionTimeoutSeconds: 2
});


// 2, defining the schema
async function setupTypesense() {
    const productSchema = {
        name: 'products',
        fields: [
            { name: 'title', type: 'string' },
            { name: 'description', type: 'string' },
            { name: 'brand', type: 'string', facet: true },
            { name: 'category', type: 'string', facet: true },
            { name: 'price', type: 'float', facet: true },
            { name: 'rating', type: 'float' }
        ]
    };

    // Delete the collection if it already exists (useful for testing)
    try {
        await client.collections('products').delete();
    } catch (err) {
        // Collection doesn't exist yet, which is fine
    }

    // Create the new collection
    console.log("Creating collection...");
    await client.collections().create(productSchema);
}

//3. Add the data (Indexing)
async function indexData() {
    const products = [
        { id: "1", title: "Nike Air Max", description: "Running shoes", brand: "Nike", category: "Shoes", price: 120.0, rating: 4.5 },
        { id: "2", title: "Adidas Ultraboost", description: "Comfortable sneakers", brand: "Adidas", category: "Shoes", price: 150.0, rating: 4.8 },
        { id: "3", title: "Sony WH-1000XM5", description: "Noise cancelling headphones", brand: "Sony", category: "Electronics", price: 348.0, rating: 4.9 },
        { id: "4", title: "Apple MacBook Pro", description: "M3 Pro Chip laptop", brand: "Apple", category: "Electronics", price: 1999.0, rating: 4.7 },
        { id: "5", title: "Redmi IBook 15Pro", description: "M3 Pro Chip laptop", brand: "Apple", category: "Electronics", price: 1999.0, rating: 4.7 }
    ];

    console.log("Indexing products...");
    await client.collections('products').documents().import(products, { action: 'create' });
}
//4. search and filter
async function searchProducts() {
    const searchParameters = {
        q: 'laptop',                  // The user's search query (with a typo!)
        query_by: 'title,description',   // Tell Typesense to search inside both title and description
        // filter_by: 'price: < 400',       // Only show items under $400
        facet_by: 'brand,category',      // Get counts for the sidebar
    };

    console.log("Searching...");
    const searchResults = await client.collections('products_live').documents().search(searchParameters);

    // Print out the matching documents
    console.log("\n--- Search Results ---");
    searchResults.hits.forEach(hit => {
        console.log(`Found: ${hit.document.title} - $${hit.document.price}`);
    });
}


//creating synonyms
async function setupSynonyms() {
    const synonymRule = {
        synonyms: ['shoes', 'sneakers', 'kicks', 'footwear']
    };

    // Give the dictionary to the 'products' warehouse
    await client.collections('products').synonyms().upsert('shoe-synonyms', synonymRule);

    console.log("✅ Synonyms added! Searching for 'kicks' will now find 'shoes'.");
}

// VIP Lists
async function setupOverrides() {
    const vipRule = {
        rule: {
            query: 'laptop',
            match: 'exact'
        },
        includes: [
            { id: '4', position: 1 } // Force document ID '4' to the very top
        ]
    };

    await client.collections('products').overrides().upsert('promote-macbook', vipRule);
    console.log("✅ Override added! The MacBook is now VIP for the word 'laptop'.");
}

// the sign change(collection aliases)
// async function setupAlias() {
//     // 1. Create a brand new warehouse
//     const newSchema = {
//         name: 'products_v2', // Notice the new name
//         fields: [{ name: 'title', type: 'string' }]
//     };
//     await client.collections().create(newSchema);

//     // 2. Hang a permanent sign that points to the new warehouse
//     await client.aliases().upsert('products_live', {
//         collection_name: 'products_v2'
//     });

//     console.log("✅ Alias created! Your frontend can now just search 'products_live'.");
// }
async function setupAlias() {
    // Hang a permanent sign that points directly to our existing 'products' warehouse
    await client.aliases().upsert('products_live', {
        collection_name: 'products'
    });

    console.log("✅ Alias created! Your frontend can now just search 'products_live'.");
}
async function run() {
    await setupTypesense();
    await indexData();
    await setupSynonyms();
    await setupOverrides();
    await setupAlias();
    await searchProducts();
}

run();