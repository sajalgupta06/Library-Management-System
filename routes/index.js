var express = require('express');
var router = express.Router();


var userModel = require("../models").User
var categoryModel = require("../models").Category
var bookModel = require("../models").Book

/* GET home page. */
router.get("/admin", async function(req, res, next) {
  
  
  var total_cat = await categoryModel.count()
  var total_users = await userModel.count()
  var total_books = await bookModel.count()
  
  res.render("admin/dashboard",{
    users:total_users,
    categories:total_cat,
    books:total_books
  });
});


module.exports = router;
