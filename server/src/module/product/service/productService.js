/* eslint-disable class-methods-use-this */
const ProductIdNotDefinedError = require('../error/ProductIdNotDefinedError');
const ProductNotDefinedError = require('../error/ProductNotDefinedError');
const Product = require('../entity/entity');
const { calculatePrice } = require('../../management/utils/calculatePrice');

module.exports = class ProductService {
  /**
   * @param  {import("../repository/productRepository")} ProductRepository
   */
  constructor(ProductRepository, CategoryService, DiscountService) {
    this.ProductRepository = ProductRepository;
    this.CategoryService = CategoryService;
    this.DiscountService = DiscountService;
  }

  /**
   * @param {Product} product
   */
  async save(product, categoriesIds, discountsIds) {
    if (!(product instanceof Product)) {
      throw new ProductNotDefinedError();
    }

    await this.validateCategoriesDiscounts(product, categoriesIds);

    return this.ProductRepository.save(product, categoriesIds, discountsIds);
  }

  async validateCategoriesDiscounts(product, categoriesIds) {
    const categories = await this.CategoryService.getByIds(categoriesIds);
    categories.forEach((category) => {
      category.discounts.forEach((discount) => {
        const price = calculatePrice(discount, product.defaultPrice);
        if (price.finalPrice <= 0) {
          throw new Error(
            `No se puede guardar el producto porque al aplicarle el/los descuento de la/s categorias su precio final es ${price.finalPrice}`
          );
        }
      });
    });
  }

  async validateProductsDiscounts(product, discountsIds) {
    const discounts = await this.DiscountService.getByIds(discountsIds);
    discounts.map((discount) => {
      const price = calculatePrice(discount, product.defaultPrice);
      if (price.finalPrice <= 0) {
        throw new Error(
          `No se puede guardar el producto porque al aplicarle el/los descuentos del producto su precio final es ${price.finalPrice}`
        );
      }
    });
  }

  /**
   * @param {number} id
   */
  async getById(id) {
    if (!Number(id)) {
      throw new ProductIdNotDefinedError();
    }
    return this.ProductRepository.getById(id);
  }

  /**
   * @param {Product} product
   */
  async delete(product) {
    if (!(product instanceof Product)) {
      throw new ProductNotDefinedError();
    }
    return this.ProductRepository.delete(product);
  }

  async getAll() {
    return this.ProductRepository.getAll();
  }

  /**
   * @param {string} term
   */
  async getAllProductsSearch(term) {
    return this.ProductRepository.getAllProductsSearch(term);
  }
};
