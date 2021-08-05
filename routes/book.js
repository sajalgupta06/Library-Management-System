var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize')

var categoryModel = require("../models").Category
var bookModel = require("../models").Book
var optionModel = require("../models").Option


var Op = Sequelize.Op

/* GET home page. */
router.get('/admin/add-book',async function(req, res, next) {

var categories = await categoryModel.findAll({
  where:{
    status:{
      [Op.eq]:'1'
    } 
  }
})

var currency_data = await optionModel.findOne({
  where:{
    option_name:{
      [Op.eq]:"active_currency"
    }
  }
})

res.render('admin/add-book',{
  categories:categories,
  currency_data:currency_data
})

});

router.get('/admin/list-book', async function(req, res, next) {
    
  var books =  await bookModel.findAll({
    include:{
      model:categoryModel,
      attributes:["name"]
    }
  })
  var currency_data = await optionModel.findOne({
    where:{
      option_name:{
        [Op.eq]:"active_currency"
      }
    }
  })
  
  res.render('admin/list-book',{
    books:books,
    currency_data:currency_data
  });
  });



router.post('/admin/add-book',  function(req, res, next) {
    
    if(!req.files){
      req.flash("error","Please upload the image")
    }else{
      var img_attr = req.files.cover_image;
      img_attr.mv("./public/uploads/"+img_attr.name)
      
      var valid_img_ext = ["image/png","image/jpg","image/jpeg"]
      if(valid_img_ext.includes(img_attr.mimetype)){
        bookModel.create({
          name:req.body.name,
          categoryId:req.body.dd_category,
          description:req.body.description,
          amount:req.body.amount,
          author:req.body.author,
          status:req.body.status,
          cover_image:"/uploads/"+img_attr.name
        }).then(data=>{
          if(data){
            req.flash("success","Book has been created")
          }
          else{
            req.flash("error","Failed to create book")
  
          }
          res.redirect("/admin/add-book")
        })
      }else{
        req.flash("error","Invalid file selected")
        res.redirect("/admin/add-book")
      }

  

    }
    
    
  });



  router.get('/admin/edit-book/:bookId', async function(req, res, next) {
    
    var book_data =  await bookModel.findOne({
      where:{
       id:{
          [Op.eq]:req.params.bookId
       }
      }
    })

    var categories = await categoryModel.findAll({
      where:{
        status:{
          [Op.eq]:'1'
        } 
      }
    })
    var currency_data = await optionModel.findOne({
      where:{
        option_name:{
          [Op.eq]:"active_currency"
        }
      }
    })
    
    res.render('admin/edit-book',{
      book:book_data,
      categories:categories,
      currency_data:currency_data
      
    });
    });


  router.post('/admin/edit-book/:bookId', async function(req, res, next) {
    

    if(!req.files){
        
      bookModel.update({
        name:req.body.name,
        categoryId:req.body.dd_category,
        description:req.body.description,
        amount:req.body.amount,
        author:req.body.author,
        status:req.body.status,
      },{
        where:{
          id:{
            [Op.eq]:req.params.bookId
          }
        }
      }).then(data=>{
        if(data){
          req.flash("success","Book has been successfully updated")
        }else{
          req.flash("error","Failed to update book")

        }
        res.redirect("/admin/edit-book/"+req.params.bookId)
      })
    }else{
      var img_attr = req.files.cover_image;
      img_attr.mv("./public/uploads/"+img_attr.name)
      
      var valid_img_ext = ["image/png","image/jpg","image/jpeg"]
      if(valid_img_ext.includes(img_attr.mimetype)){
        bookModel.update({
          name:req.body.name,
          categoryId:req.body.dd_category,
          description:req.body.description,
          amount:req.body.amount,
          author:req.body.author,
          status:req.body.status,
          cover_image:"/uploads/"+img_attr.name
        },{
          where:{
            id:{
              [Op.eq]:req.params.bookId
            }
          }
        }).then(data=>{
          if(data){
            req.flash("success","Book has been successfully updated")
          }
          else{
            req.flash("error","Failed to update book")
  
          }
          res.redirect("/admin/edit-book/"+req.params.bookId)
        })
      }else{
        req.flash("error","Invalid file selected")
        res.redirect("/admin/edit-book/"+req.params.bookId)
      }

  

    }

    });


    router.post('/admin/delete-book/:bookId',  function(req, res, next) {
    
      bookModel.findOne({
        where:{
          id:{
            [Op.eq]:req.body.book_id
          }
        }
      }).then(data=>{
        if(data){
            bookModel.destroy({
              where:{
                id:{
                  [Op.eq]:req.body.book_id
                }
              }
            }).then(status=>{
              if(status){

                req.flash("success","Book has been deleted ")
                res.redirect("/admin/list-book")

              }else{
    req.flash("error","Failed to delete book")
          res.redirect("/admin/list-book")
              }
            })

        }else{
          req.flash("error","Invalid Book Id")
          res.redirect("/admin/list-book")

        }
      })


      });
  


module.exports = router;
 