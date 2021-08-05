var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize")
var Op = Sequelize.Op

var userModel = require("../models").User
var issueBookModel = require("../models").IssueBook
var bookModel = require("../models").Book
var categoryModel = require("../models").Category

/* GET home page. */
router.get('/admin/return-a-book', async function(req, res, next) {

  var all_users = await userModel.findAll({
    where:{
      status:{
        [Op.eq]:"1"
      }
    }
  })


  res.render('admin/return-a-book',{
    users:all_users
  });
});


router.post('/admin/user-list-book', async function(req, res, next) {
  
  var user_id = req.body.user_id
 
  var all_books = await issueBookModel.findAll({
    
    include:[
      {
        model:bookModel,
        attributes:["name"]
      }
    ]
    ,where:{

      userId:{
        [Op.eq]:user_id
      },
      is_returned:{
        [Op.eq]:"0"
      }
    },
    attributes:["bookId"]
  })

  // res.render('admin/return-list');
  return res.json({
    status:1,
    books:all_books
  })
});


router.post('/admin/return-a-book', function(req, res, next) {

  issueBookModel.update({
    is_returned:'1',
    returned_date:Sequelize.fn("NOW")

  },{
    where:{
      userId:{
        [Op.eq]:req.body.dd_user  
      },
      bookId:{
        [Op.eq]:req.body.dd_book 
      },
      is_returned:'0'

    }
  }).then(status=>{
    if(status){
      req.flash("success","Book has been returned successfully")
    }else{
      req.flash("error","Failed to return book")
    }
    res.redirect("/admin/return-a-book")
  })
  
});

router.get('/admin/return-list', async function(req, res, next) {
  
  var returnList = await issueBookModel.findAll({
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
    attributes:["days_issued","returned_date"],
    where:{
      is_returned:{
        [Op.eq]:"1"
      }
    }
  })
res.render("admin/return-list",{
list:returnList
})

});

module.exports = router;
 