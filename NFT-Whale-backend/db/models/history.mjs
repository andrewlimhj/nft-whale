export default function initHistoryModel(sequelize, DataTypes) {
  return sequelize.define('history', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    contractName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contractAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactions: {
      type: DataTypes.JSON,
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  });
}
