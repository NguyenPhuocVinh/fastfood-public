import connectDB from "./db/connect.js";
import app from "./config.js";
import authRouter from "./routes/client/authRoutes.js";
import userRouter from "./routes/client/userRoutes.js";
import payRouter from "./routes/client/payRoutes.js";
import authAdminRoutes from "./routes/admin/authAdminRoutes.js";
import notFoundMiddleware from "./middleware/not-found.js";
import errorMiddleware from "./middleware/error-handler.js";

import productRouter from "./routes/client/productRoutes.js";
import categoryRouter from "./routes/client/categoryRoutes.js";
import productAdminRoutes from "./routes/admin/productAdmimRoutes.js";
import categoryAdminRouter from "./routes/admin/categoryAdminRoutes.js";
import orderAdminRouter from "./routes/admin/orderAdminRoutes.js";
import userAdminRoutes from "./routes/admin/userAdminRoutes.js";
import orderRouter from "./routes/client/orderRoutes.js";
import productCategoryRoutes from "./routes/client/productCategoryRoutes.js";

app.get("/", (req, res) => {
  throw new Error("Error");
  res.status(200).render("base", { title: "Home" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/pay", payRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/order", orderRouter);
app.use("/api/v1/productcategory", productCategoryRoutes);
app.use("/admin", authAdminRoutes);
app.use("/admin", productAdminRoutes);
app.use("/admin", categoryAdminRouter);
app.use("/admin", orderAdminRouter);
app.use("/admin", userAdminRoutes);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
