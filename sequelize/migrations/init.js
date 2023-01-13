'use strict';

const {rm} = require("fs")
const ProductEntity = require('../../app/models/entites/product');
const UserEntity = require('../../app/models/entites/user');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const user_entity = new UserEntity(Sequelize)
    const product_entity = new ProductEntity(Sequelize)
    await queryInterface.createTable('users', user_entity.attribute);
    await queryInterface.createTable('products', product_entity.attribute)
  },

  async down(queryInterface, Sequelize) {
    // need drop table product first for foreign key cascade
    await queryInterface.dropTable('products');
    await queryInterface.dropTable('users');
  }
};

function clearDirUpload() {}