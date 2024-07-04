const productTypeService = require("../services/productTypeService");

// Get categories details
async function getAllProductType(req, res) {
    try {
        const productTypeDetails = await productTypeService.fetchProductType();
        
         // Transform the category details to only include id and name
         const transformedCategories = productTypeDetails.results.map(producttype => ({
            id: producttype.id,
            name: producttype.name// Adjust based on your language preference
        }));

        res.json(transformedCategories);
        //console.log("product type controller", transformedCategories);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = {
    getAllProductType
};
