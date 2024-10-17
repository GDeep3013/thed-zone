
export const getProduct = async (id,shop) => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/${id}?shop=${shop}`);
    const data = await response.json();
    return data;

};


export const getProducts = async (ids,shop,fields = "") => {

    const response = await fetch(`${import.meta.env.VITE_API_URL}/products/?ids=${ids}&shop=${shop}&fields=${fields}`);
    const data = await response.json();
    return data;

};


export const getIDs = async (jsonObject) => {

    // Step 2: Extract unique product IDs
    const uniqueProductIds = new Set();

    Object.keys(jsonObject).forEach((key) => {
    const item = jsonObject[key];
    uniqueProductIds.add(item.product_id);
    });
    // Step 3: Convert Set to Array
    const productIds = Array.from(uniqueProductIds);
    return productIds;

};