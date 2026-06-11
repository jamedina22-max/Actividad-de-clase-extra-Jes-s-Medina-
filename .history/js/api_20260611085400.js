
async function checkAndLoadAPIProducts() {
    let localProducts = getLocalData(KEYS.PRODUCTS);
    
    // Si ya hay productos en LocalStorage (así sean los creados por el Admin), no vuelve a llamar a la API
    if (localProducts.length === 0) {
        try {
            console.log("Poblando catálogo desde FakeStoreAPI por primera vez...");
            const response = await fetch('https://fakestoreapi.com/products');
            const data = await response.json();
            
            // Adaptamos o guardamos directamente los productos agregándoles stock y feedback base
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