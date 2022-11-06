const Product = require("../models/productModel.js");
const ErrorHander = require("../utils/ErrorHander.js");
const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ApiFeatures = require("../utils/apiFeatures.js");

//Create Product
exports.craeteProduct = catchAsyncErrors(async (req, res, next) => {
  req.body.user = req.user.id;
  const product = await Product.create(req.body);
  res.status(201).json({
    success: true,
    product,
  });
});

// Get all product
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
  const resultPerPage = 5;
  const productCount = await Product.countDocuments();
  const apiFeature = new ApiFeatures(Product.find(), req.query)
    .search()
    .filter();

  let products = await apiFeature.query;

  let filteredProductsCount = products.length;

  apiFeature.pagination(resultPerPage);

  res.status(200).json({
    success: true,
    products,
    productCount,
    resultPerPage,
    filteredProductsCount,
  });
});

// Get product Details
exports.getProductDetails = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  if (id.length === 24) {
    const product = await Product.findById(id);
    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }

    res.status(200).json({
      success: true,
      product,
    });
  } else {
    return next(new ErrorHander("Product not found", 404));
  }
});

// Update Product --Admin
exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  if (id.length === 24) {
    let product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      success: true,
      product,
    });
  } else {
    return next(new ErrorHander("Product not found", 404));
  }
});

//Delete Product
exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  if (id.length === 24) {
    const product = await Product.findById(id);

    if (!product) {
      return next(new ErrorHander("Product not found", 404));
    }

    await product.remove();
    res.status(200).json({
      success: true,
      message: "Product Deleted Successfully",
    });
  } else {
    return next(new ErrorHander("Product not found", 404));
  }
});

// Create new review or Update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString())
        (rev.rating = rating), (rev.comment = comment);
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // ============================
  // 4 , 5 ,5,2 = 16/4 = 4
  let avg = 0;

  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  product.ratings = avg / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

// Get all Reviews of a product
exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.id);

  if (!product) {
    return next(new ErrorHander("Product not found ", 404));
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
});

// Delete Review
exports.deleteReview = catchAsyncErrors(async (req, res, next) => {
  const product = await Product.findById(req.query.productId);

  if (!product) {
    return next(new ErrorHander("Product not found ", 404));
  }

  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== req.query.id.toString()
  );

  let avg = 0;

  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  const ratings = avg / reviews.length;

  const numOfReviews = reviews.length;

  await Product.findByIdAndUpdate(
    req.query.productId,
    {
      reviews,
      ratings,
      numOfReviews,
    },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  res.status(200).json({
    success: true,
  });
});
