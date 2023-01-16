'use strict';
const JWT_SECRET_KEY = !process.env.JWT_SECRET_KEY || process.env.JWT_SECRET_KEY === "" ? "e19c26220938b93064126f259a4564b3" : process.env.JWT_SECRET_KEY
const MAGIC_KEY_SHA256 = !process.env.MAGIC_KEY_SHA256 || process.env.MAGIC_KEY_SHA256 === "" ? "--BULU_KNTL_001--" : process.env.MAGIC_KEY_SHA256
const uuid = require("uuid")
const Helper = require("../../app/helper/helper");
const helper = new Helper(JWT_SECRET_KEY, MAGIC_KEY_SHA256)
const date = new Date()
const fakeEmail = ["rikian@coolguy.com", "frizka@gmail.com", "boim@gmail.com"]
const fakeName = ["rikian", "frizka", "boim"]
const fakeUser = []

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    for (let i = 0; i < 3; i++) {
      fakeUser.push({
        "user_id" : uuid.v4(),
        "user_email" : fakeEmail[i],
        "user_password" : helper.sha256("1234567"),
        "user_name" : fakeName[i],
        "created_at": date.toString(),
        "updated_at": date.toString()
      })
    }
    
    return queryInterface.bulkInsert('users', fakeUser);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
