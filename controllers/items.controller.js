const { response } = require('express');
const { makeRequestByURL } = require('../services/mercado-libre.service');
const { URL_API } = process.env;
const author = {
  name: 'Marvin Daniel',
  lastname: 'Cely Báez',
};

const getProductList = async (req, res = response) => {
  const query = req.query.q;
  const endpoint = `${URL_API}/sites/MLA/search?q=${query}`;

  try {
    const { results, filters } = await makeRequestByURL(endpoint);

    const categoryFilter = filters.find(({ id }) => id === 'category');

    const categories = categoryFilter.values[0].path_from_root.map(({ name }) => name);

    const items = results.map((item) => {
      const {
        id,
        title,
        prices: { presentation },
        price: current_price,
        thumbnail,
        condition,
        shipping: { free_shipping },
      } = item;

      const [amount, decimals] = current_price.toString().split('.');
      const price = {
        currency: presentation.display_currency,
        amount,
        decimals,
      };

      return {
        id,
        title,
        price,
        picture: thumbnail,
        condition,
        free_shipping,
      };
    });

    const data = {
      author,
      categories,
      items,
    };

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: 'Error Inesperado: revisar logs.',
    });
  }
};

const getItem = async (req, res = response) => {
  const { id } = req.params;
  const itemURL = `${URL_API}/items/${id}`;
  const descriptionURL = `${URL_API}/items/${id}/description`;
  try {
    const [selectedItem, description] = await Promise.all([
      makeRequestByURL(itemURL),
      makeRequestByURL(descriptionURL),
    ]);

    const {
      id,
      title,
      price: the_price,
      pictures,
      condition,
      shipping: { free_shipping },
      sold_quantity,
      currency_id,
    } = selectedItem;

    const [amount, decimals] = the_price.toString().split('.');
    const price = {
      currency: currency_id,
      amount,
      decimals,
    };

    const item = {
      id,
      title,
      price,
      picture: pictures[0].url,
      condition,
      free_shipping,
      sold_quantity,
      description: description.plain_text,
    };

    const data = {
      author,
      item,
    };

    res.json({
      ok: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      ok: false,
      msg: 'Error Inesperado: revisar logs.',
    });
  }
};

module.exports = {
  getProductList,
  getItem,
};
