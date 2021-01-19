const { fromModelToEntity } = require('../mapper/categoryMapper');
const { fromModelToEntity: fromModelToProductEntity } = require('../../product/mapper/mapper');
const CategoryNotDefinedError = require('../error/CategoryNotDefinedError');
const CategoryIdNotDefinedError = require('../error/CategoryIdNotDefinedError');
const CategoryNotFoundError = require('../error/CategoryNotFoundError');
const Category = require('../entity/Category');

module.exports = class CategoryRepository {
  /**
   * @param {typeof import('../model/categoryModel')} categoryModel
   */
  constructor(categoryModel, productModel) {
    this.categoryModel = categoryModel;
    this.productModel = productModel;
  }

  /**
   * @param {import('../entity/Category')} category
   */
  async save(category) {
    if (!(category instanceof Category)) {
      throw new CategoryNotDefinedError();
    }

    let categoryModel;
    const buildOptions = { isNewRecord: !category.id };
    categoryModel = this.categoryModel.build(category, buildOptions);
    categoryModel = await categoryModel.save();

    return fromModelToEntity(categoryModel);
  }

  async getAll() {
    const categoryInstances = await this.categoryModel.findAll();
    return categoryInstances.map(fromModelToEntity);
  }

  /**
   * @param {number} categoryId
   */
  async getById(categoryId) {
    if (!Number(categoryId)) {
      throw new CategoryIdNotDefinedError();
    }
    const categoryInstance = await this.categoryModel.findByPk(categoryId);
    if (!categoryInstance) {
      throw new CategoryNotFoundError(`There is no existing category with ID ${categoryId}`);
    }

    return fromModelToEntity(categoryInstance);
  }

  /**
   * @param {import('../entity/Category')} category
   * @returns {Promise<Boolean>} Returns true if a car was deleted, otherwise it returns false
   */
  async delete(category) {
    if (!(category instanceof Category)) {
      throw new CategoryNotDefinedError();
    }

    return Boolean(await this.categoryModel.destroy({ where: { id: category.id } }));
  }

  async viewProducts(categoryId) {
    const products = await this.categoryModel.findByPk(categoryId, {
      include: { model: this.productModel, as: 'products' },
    });
    return products.products.map((product) => fromModelToProductEntity(product));
  }
};
