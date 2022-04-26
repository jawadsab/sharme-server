const paginate = (model) => {
  return async function (req, res, next) {
    const page = req.query.page;
    const limit = req.query.limit;


    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    try {
       
      const results = await model.find().sort({createdAt:-1}).populate("postedBy","username profileImage").limit(limit).skip(startIndex).exec();
      res.results = results;
      next();
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
};


export default paginate;