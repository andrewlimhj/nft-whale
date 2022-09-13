module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('owners', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      contractName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contractAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      holdings: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable('histories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      contractName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      contractAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transactions: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface) => {
    queryInterface.dropTable('owners');
    queryInterface.dropTable('history');
  },
};
