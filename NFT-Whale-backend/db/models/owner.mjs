export default function initOwnerModel(sequelize, DataTypes) {
  return sequelize.define('owner', {
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
    holdings: {
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
