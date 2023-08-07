const categoryRoute = require("./categoryRoutes");
const productRoute = require("./ProductRoute");
const usersRoute = require("./UserRoute");
const authRoute = require("./authRoute");
const reviewRoute = require("./ReviewRoute");
const wishlistRoute = require("./wishlistRoute");
const addressRoute = require("./addressRoute");
const couponRoute = require("./CouponRoute");
const cartRoute = require("./CartRoute");
const orderRoute = require("./orderRoute");

//----------------------------------------------------------------------
//Mount Routes
const mountRoutes = (app)=>{
app.use("/api/v1/pstore/categories", categoryRoute);
app.use("/api/v1/pstore/products", productRoute);
app.use("/api/v1/pstore/users", usersRoute);
app.use("/api/v1/pstore/auth", authRoute);
app.use("/api/v1/pstore/reviews", reviewRoute);
app.use("/api/v1/pstore/wishlist", wishlistRoute);
app.use("/api/v1/pstore/addresses", addressRoute);
app.use("/api/v1/pstore/coupons", couponRoute);
app.use("/api/v1/pstore/cart", cartRoute);
app.use("/api/v1/pstore/orders", orderRoute);
}

module.exports = mountRoutes;