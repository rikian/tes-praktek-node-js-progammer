const { Sequelize } = require('sequelize');
/**
 * 
 * @param {object} protocol string
 * @returns 
 */
module.exports = ({
    dialect, 
    username, 
    password, 
    host, 
    port, 
    database
}) => new Sequelize(`${dialect}://${username}:${password}@${host}:${port}/${database}`)
