var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize")
var Op = Sequelize.Op

var userModel = require("../models").User
var categoryModel = require("../models").Category
var bookModel = require("../models").Book
var IssueBookModel = require("../models").IssueBook
var daysModel = require("../models").DaySetting


/* GET home page. */
router.get('/admin/issue-a-book', async function(req, res, next) {
 
  var categories = await categoryModel.findAll({
    where:{
      status:{
        [Op.eq]:'1'
      } 
    }
  })
  var users = await userModel.findAll({
    where:{
      status:{
        [Op.eq]:'1'
      } 
    }
  })
  var books = await bookModel.findAll({
    where:{
      status:{
        [Op.eq]:'1'
      } 
    }
  })
  var days= await daysModel.findAll();


  res.render('admin/issue-a-book',{
    users:users,
    categories:categories,
    books:books,
    days:days
  })

});

router.post('/admin/category-list-book', async function(req, res, next) {

 var category_id = req.body.cat_id;
 var books = await bookModel.findAll({
   where:{
     categoryId:{
       [Op.eq]:category_id
     }
   }
 })

 return res.json({
   status:"1",
   books:books
 })

  
});



  router.post('/admin/issue-a-book', async function(req, res, next) {
  
    var is_book_issued = await IssueBookModel.count({
      where:{
        userId:{
          [Op.eq]:req.body.dd_user

        }, 
        bookId:{
          [Op.eq]:req.body.dd_book

        },
        is_returned:{
          [Op.eq]:'0'

        }
      }
    })

    if(is_book_issued>0){
      req.flash("error","Book has been already issued to a user ")
      res.redirect("/admin/issue-a-book")
    }else{
      var count_books = await IssueBookModel.count({
        where:{
          userId:{
            [Op.eq]:req.body.dd_user
          },
          is_returned:{
            [Op.eq]:"0"
          }
        }
      })
 
      if(count_books>=2){
       req.flash("error","Maximum 2 books are allowed ")
       res.redirect("/admin/issue-a-book")
      }else{
       IssueBookModel.create({
         categoryId:req.body.dd_category,
         bookId:req.body.dd_book,
         userId:req.body.dd_user,
         days_issued:req.body.dd_days
       }).then(status=>{
         if(status){
           req.flash("success","Book has been successfully issued")
           res.redirect('/admin/list-issue-book')
         }else{
           req.flash("error","Failed to issue Book")
           res.redirect('/admin/list-issue-book')
         }
       })  
      }
 
    }
  });

  router.get('/admin/list-issue-book', async function(req, res, next) {
  
      var issueList = await IssueBookModel.findAll({
        include:[
          {
            model:categoryModel,
            attributes:["name"]
          },
          {
            model:userModel,
            attributes:["name","email"]
            
          },
          {
            model:bookModel,
            attributes:["name"]
            
          },
        ],
        attributes:["days_issued","issued_date"],
        where:{
          is_returned:{
            [Op.eq]:"0"
          }
        }
      })
res.render("admin/list-issue-book",{
  list:issueList
})

  });



module.exports = router;
 