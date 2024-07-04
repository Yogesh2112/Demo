const client = require('../middleware/commercetools');

const createProduct = async (data) => {
  const { categoryId, productTypeId, name, price, color, size, imageUrl, description, material } = data;

  const productData = {
    productType: {
      id: productTypeId,
      typeId: "product-type"
    },
    categories: [
      {
        typeId: "category",
        id: categoryId
      }
    ],
    name: {
      "en-US": name
    },
    slug: {
      "en-US": `${name.toLowerCase().replace(/\s+/g, '-')}-product`
    },
    description: {
      "en-US": description
    },
    masterVariant: {
      sku: `SKU-${Math.floor(Math.random() * 1000)}`,
      prices: [
        {
          value: {
            currencyCode: "INR",
            centAmount: price
          }
        }
      ],
      images: [
        {
          url: imageUrl,
          label: "Master Image",
          dimensions: {
            w: 303,
            h: 197
          }
        }
      ],
      attributes: [
        {
          name: "Color",
          value: {
            "en-US": color
          }
        },
        {
          name: "Size",
          value: {
            "en-US": size
          }
        },
        {
          name: "Material",
          value: {
            "en-US": material
          }
        },
      ]
    }
  };

  try {
    const response = await client.execute({
      uri: '/handicraft/products',
      method: 'POST',
      body: productData
    });
    console.log("service response from adding product", response);

    return response.body;

  } catch (error) {
    console.error('Error posting product to Commercetools:', error.response ? error.response.body : error.message);
    throw new Error('Error posting product to Commercetools');
  }
};

module.exports = {
  createProduct
};
