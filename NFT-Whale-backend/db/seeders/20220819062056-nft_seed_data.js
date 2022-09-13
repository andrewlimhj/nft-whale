// const Moralis = require('moralis/node');
const getAllOwners = require('../../controllers/owners.controller.js');

module.exports = {
  up: async (queryInterface) => {
    const nftAddress = [
      {
        name: 'Moonbirds',
        address: '0x23581767a106ae21c074b2276D25e5C3e136a68b',
      },
      {
        name: 'BoredApeYachtClub',
        address: '0xBC4CA0EdA7647A8aB7C2061c2E118A18a936f13D',
      },
      {
        name: 'VeeFriends',
        address: '0xa3AEe8BcE55BEeA1951EF834b99f3Ac60d1ABeeB',
      },
      {
        name: 'Azuki',
        address: '0xED5AF388653567Af2F388E6224dC7C4b3241C544',
      },
      {
        name: 'CryptoPunks',
        address: '0xb47e3cd837dDF8e4c57F05d70Ab865de6e193BBB',
      },
      {
        name: 'Cool Cats',
        address: '0x1A92f7381B9F03921564a437210bB9396471050C',
      },
      {
        name: 'Goblin Town',
        address: '0xbCe3781ae7Ca1a5e050Bd9C4c77369867eBc307e',
      },
      {
        name: 'mfers',
        address: '0x79FCDEF22feeD20eDDacbB2587640e45491b757f',
      },
      {
        name: 'Clone X',
        address: '0x49cF6f5d44E70224e2E23fDcdd2C053F30aDA28B',
      },
      {
        name: 'Doodles',
        address: '0x8a90CAb2b38dba80c64b7734e58Ee1dB38B8992e',
      },
      {
        name: 'Beanz',
        address: '0x306b1ea3ecdf94aB739F1910bbda052Ed4A9f949',
      },
      {
        name: 'Chimpers',
        address: '0x80336Ad7A747236ef41F47ed2C7641828a480BAA',
      },
      {
        name: 'Impostors',
        address: '0x3110EF5f612208724CA51F5761A69081809F03B7',
      },
      {
        name: 'KaijuKingz',
        address: '0x0c2E57EFddbA8c768147D1fdF9176a0A6EBd5d83',
      },
    ];

    const ownerData = [];
    const historyData = [];

    for (let i = 0; i < nftAddress.length; i += 1) {
      const contractAddress = nftAddress[i].address;
      const contractName = nftAddress[i].name;

      // eslint-disable-next-line no-await-in-loop
      const { owners } = await getAllOwners(contractAddress);
      // eslint-disable-next-line no-await-in-loop
      const { history } = await getAllOwners(contractAddress);

      const jsonContentOwners = JSON.stringify(owners);
      const jsonContentHistory = JSON.stringify(history);

      const owner = {
        contractName,
        contractAddress,
        holdings: jsonContentOwners,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const histories = {
        contractName,
        contractAddress,
        transactions: jsonContentHistory,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      ownerData.push(owner);
      historyData.push(histories);
    }

    try {
      const contentOwners = await queryInterface.bulkInsert(
        'owners',
        ownerData
      );
      console.log('content owners: ', contentOwners);

      const contentHistory = await queryInterface.bulkInsert(
        'histories',
        historyData
      );
      console.log('content history: ', contentHistory);
    } catch (error) {
      console.log('Error: ', error);
    }
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('items', null, {});
  },
};
