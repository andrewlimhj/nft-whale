const Moralis = require('moralis/node');

module.exports = async function getAllOwners(contractAddress) {
  const { MORALIS_SERVER_URL } = process.env;
  const { MORALIS_APP_ID } = process.env;

  const serverUrl = MORALIS_SERVER_URL;

  const appId = MORALIS_APP_ID;

  // eslint-disable-next-line no-extend-native
  Array.prototype.getUnique = () => {
    const uniques = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0, l = this.length; i < l; ++i) {
      // eslint-disable-next-line eqeqeq
      if (this.lastIndexOf(this[i]) == this.indexOf(this[i])) {
        uniques.push(this[i]);
      }
    }
    return uniques;
  };

  const averagePrice = (array) => {
    const filteredZero = array.filter((item) => item !== 0);
    const filtered = filteredZero.getUnique();

    if (filtered.length > 1) {
      return (
        filtered.reduce((a, b) => Number(a) + Number(b)) /
        filtered.length /
        1e18
      );
      // eslint-disable-next-line no-else-return
    } else if (filtered.length === 1) {
      return filtered[0] / 1e18;
    } else {
      return 0;
    }
  };

  const averageDaySinceBuy = (array) => {
    let ms;

    if (array.length > 1) {
      // eslint-disable-next-line operator-linebreak
      ms =
        array.reduce((a, b) => new Date(a).getTime() + new Date(b).getTime()) /
        array.length;
    } else {
      ms = new Date(array[0]).getTime();
    }

    const diff = Math.floor((new Date().getTime() - ms) / 86400000);

    return diff;
  };

  // eslint-disable-next-line object-shorthand
  await Moralis.start({ serverUrl: serverUrl, appId: appId });
  let cursor = null;
  const owners = {};
  const history = {};
  let res;
  const accountedTokens = [];

  const date = new Date();

  date.setDate(date.getDate() - 30);

  const blockOptions = {
    chain: 'Eth',
    // eslint-disable-next-line object-shorthand
    date: date,
  };

  const block = await Moralis.Web3API.native.getDateToBlock(blockOptions);

  const monthBlock = Number(block.block);

  do {
    // eslint-disable-next-line no-await-in-loop
    const response = await Moralis.Web3API.token.getContractNFTTransfers({
      address: contractAddress,
      chain: 'eth',
      limit: 100,
      // eslint-disable-next-line object-shorthand
      cursor: cursor,
    });

    res = response;
    console.log(
      `Got page ${response.page} of ${Math.ceil(
        // eslint-disable-next-line comma-dangle
        response.total / response.page_size
        // eslint-disable-next-line comma-dangle
      )}, ${response.total} total`
    );

    // eslint-disable-next-line no-restricted-syntax
    for (const transfer of res.result) {
      let recentTx = 0;
      if (monthBlock < Number(transfer.block_number)) {
        recentTx = 1;
      }

      if (
        // eslint-disable-next-line operator-linebreak
        !owners[transfer.to_address] &&
        !accountedTokens.includes(transfer.token_id)
      ) {
        owners[transfer.to_address] = {
          address: transfer.to_address,
          amount: Number(transfer.amount),
          tokenId: [transfer.token_id],
          prices: [Number(transfer.value)],
          dates: [transfer.block_timestamp],
          // eslint-disable-next-line object-shorthand
          recentTx: recentTx,
          avgHold: averageDaySinceBuy([transfer.block_timestamp]),
          avgPrice: Number(transfer.value) / 1e18,
        };

        accountedTokens.push(transfer.token_id);
      } else if (!accountedTokens.includes(transfer.token_id)) {
        // eslint-disable-next-line no-plusplus
        owners[transfer.to_address].amount++;
        owners[transfer.to_address].tokenId.push(transfer.token_id);
        owners[transfer.to_address].prices.push(Number(transfer.value));
        owners[transfer.to_address].dates.push(transfer.block_timestamp);
        // eslint-disable-next-line operator-assignment, operator-linebreak
        owners[transfer.to_address].recentTx =
          owners[transfer.to_address].recentTx + recentTx;
        owners[transfer.to_address].avgHold = averageDaySinceBuy(
          // eslint-disable-next-line comma-dangle
          owners[transfer.to_address].dates
        );
        owners[transfer.to_address].avgPrice = averagePrice(
          // eslint-disable-next-line comma-dangle
          owners[transfer.to_address].prices
        );

        accountedTokens.push(transfer.token_id);
      }

      if (owners[transfer.from_address] && recentTx === 1) {
        // eslint-disable-next-line operator-assignment, operator-linebreak
        owners[transfer.from_address].recentTx =
          owners[transfer.from_address].recentTx - recentTx;
      } else if (!owners[transfer.from_address] && recentTx === 1) {
        owners[transfer.from_address] = {
          address: transfer.from_address,
          amount: 0,
          tokenId: [],
          prices: [],
          dates: [],
          recentTx: -recentTx,
          avgHold: 0,
          avgPrice: 0,
        };
      }

      if (!history[transfer.to_address]) {
        history[transfer.to_address] = [
          {
            to: transfer.to_address,
            from: transfer.from_address,
            price: transfer.value,
            date: transfer.block_timestamp,
            tokenId: transfer.token_id,
          },
        ];
      } else {
        history[transfer.to_address].push({
          to: transfer.to_address,
          from: transfer.from_address,
          price: transfer.value,
          date: transfer.block_timestamp,
          tokenId: transfer.token_id,
        });
      }

      if (!history[transfer.from_address]) {
        history[transfer.from_address] = [
          {
            to: transfer.to_address,
            from: transfer.from_address,
            price: transfer.value,
            date: transfer.block_timestamp,
            tokenId: transfer.token_id,
          },
        ];
      } else {
        history[transfer.from_address].push({
          to: transfer.to_address,
          from: transfer.from_address,
          price: transfer.value,
          date: transfer.block_timestamp,
          tokenId: transfer.token_id,
        });
      }
    }

    cursor = res.cursor;
  } while (cursor !== '' && cursor != null);
  // } while (cursor <= 10);

  return { owners, history };
};
