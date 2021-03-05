import { sumBy, ceil } from "lodash";

const Total = {
  totalRemainderPercentage: products => {
    products = products.map(product => {
      const { total_remainder, total_receive } = product;
      let percentage = Number(
        ((total_remainder / total_receive) * 100).toFixed(2)
      );
      if (isNaN(percentage)) {
        percentage = 0;
      }
      return {
        ...product,
        totalPercentage: percentage
      };
    });
    return products;
  },

  // per  product
  totalPrices: item => {
    const { discount, quantity, product, price } = item;
    product.price = price;
    return {
      discountPercentage: discount,
      total:
        discount !== 0
          ? (product.price - (product.price / 100) * discount) * quantity
          : product.price * quantity,
      discountPrice: (product.price / 100) * discount * quantity
    };
  },

  // all products
  totalCost: (products, rate = 1) => {
    products.map(product => Total.totalPrices(product));
    return {
      totalCostPrice: ceil(
        parseFloat(sumBy(products, "total.total") / rate),
        2
      ),
      totalCostDiscount: ceil(
        parseFloat(sumBy(products, "total.discountPrice") / rate),
        2
      ),
      totalCostElements: parseFloat(sumBy(products, "quantity"))
    };
  }
};

export default Total;
