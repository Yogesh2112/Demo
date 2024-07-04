const categoryService = require("../services/categoryService");

// Get categories details
async function getCallCategories(req, res) {
    try {
        const categoryDetails = await categoryService.fetchCategories();
        
        // Transform the category details to only include id and name
        const transformedCategories = categoryDetails.results.map(category => ({
            id: category.id,
            name: category.name["en-US"] // Adjust based on your language preference
        }));

        res.json(transformedCategories);
        // console.log("category controller", transformedCategories);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

module.exports = {
    getCallCategories
};
