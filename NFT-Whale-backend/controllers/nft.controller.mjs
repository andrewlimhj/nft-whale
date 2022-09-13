class NFTController {
  constructor(db) {
    this.db = db;
  }

  getCollection = async (req, res, next) => {
    const { slug } = req.query;

    try {
      const collection = await this.db.Owner.findOne({
        where: {
          contractAddress: slug,
        },
        order: [['createdAt', 'DESC']],
      });

      if (!collection) {
        console.log('Collection not found!');
        return;
      }

      console.log('Collection: ', collection.holdings);

      res.send(collection.holdings);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  getHistory = async (req, res, next) => {
    const { slug } = req.query;
    const { address } = req.query;

    try {
      const history = await this.db.History.findOne({
        where: {
          contractAddress: slug,
        },
        order: [['createdAt', 'DESC']],
      });

      if (!history) {
        console.log('History not found!');
        return;
      }

      console.log('History: ', history.transactions[address]);

      res.send(history.transactions[address]);
    } catch (error) {
      console.log(error);
      next(error);
    }
  };
}

export default NFTController;
