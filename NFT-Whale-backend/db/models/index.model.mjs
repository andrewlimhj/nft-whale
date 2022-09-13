import sequelizePackage from 'sequelize';
import allConfig from '../../config/sequelize.config.cjs';

import initOwnerModel from './owner.mjs';
import initHistoryModel from './history.mjs';

const { Sequelize } = sequelizePackage;
const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.Owner = initOwnerModel(sequelize, Sequelize.DataTypes);
db.History = initHistoryModel(sequelize, Sequelize.DataTypes);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
