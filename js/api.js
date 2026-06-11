
async function checkAndLoadAPIProducts() {
    let localProducts = getLocalData(KEYS.PRODUCTS);
    
    if (localProducts.length === 0) {
        try {
            console.log("Poblando catálogo desde FakeStoreAPI por primera vez...");
            const response = await fetch('https://fakestoreapi.com/products');
            const data = await response.json();
            
            const structuredProducts = data.map(p => ({
                id: p.id,
                title: p.title,
                price: p.price,
                description: p.description,
                category: p.category,
                image: p.image,
                rating: { rate: p.rating?.rate || 4, count: p.rating?.count || 1 },
                reviews: [{ user: "Anónimo", stars: 5, comment: "Excelente producto inicial." }]
            }));
            
            saveLocalData(KEYS.PRODUCTS, structuredProducts);
            return structuredProducts;
        } catch (error) {
            console.error("Error cargando la API externa, usando datos vacíos", error);
            return [];
        }
    }
    return localProducts;
}