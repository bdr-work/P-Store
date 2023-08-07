class ApiFeatures {
  constructor(mongooseQuery, queryString) {
    this.mongooseQuery = mongooseQuery;
    this.queryString = queryString;
  }
  filter() {
    //take a copy from query and  Delete "fields", "sort", "page", "limit" from query then used it to filteration
    //1) filteration
    const queryStringObj = { ...this.queryString };
    const excludeFields = ["fields", "sort", "page", "limit"];
    excludeFields.forEach((field) => delete queryStringObj[field]);

    //Aplly filteration using [gte,gt,lte,lt]
    //1)convert the query to string
    let queryStr = JSON.stringify(queryStringObj);
    //2)add the $ sine to the gte , gt, lte and lt
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr));
    return this;
  }
  sort() {
    // 3) Sorting
    if (this.queryString.sort) {
      // delete , from query and add the space
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.sort(sortBy);
    } else {
      this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
    }
    return this;
  }
  fieldsLimit() {
    // 4) Fields Limitation
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.mongooseQuery = this.mongooseQuery.select(fields);
    } else {
      this.mongooseQuery = this.mongooseQuery.select("-__v");
    }
    return this;
  }
  searching(modelName) {
    // 4) Searching
    if (this.queryString.keyword) {
      let query = {};
      if (modelName === "Product") {
        query.$or = [
          { title: { $regex: this.queryString.keyword, $options: "i" } },
          { description: { $regex: this.queryString.keyword, $options: "i" } },
        ];
      } else {
        query = { name: { $regex: this.queryString.keyword, $options: "i" } };
      }
      this.mongooseQuery = this.mongooseQuery.find(query);
    }
    return this;
  }
  pajinate(countDecuments) {
    //2) Pagination
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 50;
    const skip = (page - 1) * limit; // 2-1 * 5 = 5 this will skip the first 5 results  and so on
    const endIndx = page * limit;
    //Pajination result
    const pajination = {};
    pajination.page = page;
    pajination.limit = limit;
    pajination.numberOfPages = Math.ceil(countDecuments / limit);

    //next Page
    if (endIndx < countDecuments) {
      pajination.next = page + 1;
    }
    //prev Page
    if (skip > 0) {
      pajination.prev = page - 1;
    }

    this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit);
    this.pajinationResult = pajination;
    return this;
  }
}

module.exports = ApiFeatures;
