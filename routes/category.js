var express = require('express');
var router = express.Router();
const Sequelize = require('sequelize')

var categoryModel = require("../models").Category
var Op = Sequelize.Op

/* GET home page. */
router.get('/admin/add-category', function(req, res, next) {
  res.render('admin/add-category');
});

router.post('/admin/add-category', function(req, res, next) {


  categoryModel.findOne({
    where:{
      name:{
          [Op.eq]:req.body.name
      }
    }
  }).then((data)=>{
    if(data){
      req.flash("error","Category already exists")
      res.redirect('/admin/add-category')

    }
    else{
      categoryModel.create({
        name:req.body.name,
        status:req.body.status
      }).then((category)=>{
        if(category){
          req.flash("success","Category created successfully")
          res.redirect('/admin/add-category')
        }else{
          req.flash("error","Failed to create category")
          res.redirect('/admin/add-category')
        }
      })
    }
  })

    

});
router.get('/admin/list-category', async function(req, res, next) {
   
    var categories =  await categoryModel.findAll()
  
  res.render('admin/list-category',{
    categories:categories
  });
  });


  router.get('/admin/edit-category/:categoryId',   function(req, res, next) {
   
   
    categoryModel.findOne({
      where:{
        id:{
          [Op.eq] : req.params.categoryId
        }
      }
    }).then(data=>{
      if(data){
       
        res.render('admin/edit-category',{
          category:data
        })
      }
      else{
        req.flash("error","Something went wrong")
        res.render('admin/list-category')

      }
    })


  });

  router.post('/admin/edit-category/:categoryId',   function(req, res, next) {
   
   
    categoryModel.findOne({
      where:{
        [Op.and]:[
          {
            id:{
              [Op.ne]:req.params.categoryId
            }
          },
          {
            name:{
              [Op.eq]:req.body.name
            }
          }
        ]
      }
    }).then(data=>{
      if(data){
       
        req.flash("error","Category already exists")
        res.redirect('/admin/list-category/'+req.params.categoryId)


      }
      else{

        categoryModel.update({
          name:req.body.name,
          status:req.body.status
        },{
          where:{
            
            id:req.params.categoryId
          }
        }
        ).then(data=>{
          if(data){

            req.flash("success","Category has been updated ")
          }
          else{
            req.flash("error","failed to update Category")

          }
          res.redirect('/admin/edit-category/'+req.params.categoryId)
        })


      }
    })


  });


  router.post('/admin/delete-category',   function(req, res, next) {
   
   
    categoryModel.findOne({
      where:{
       id:{
         [Op.eq]:req.body.category_id
       }
      }
    }).then(data=>{
      if(data){
       
        categoryModel.destroy({
          where:{
            id:{
              [Op.eq]:req.body.category_id
            }
          }
        }).then((status)=>{
          if(status){
            req.flash("success","Category has been deleted ")

          }else{
            req.flash("error","Failed to delete category ")

          }

          res.redirect("/admin/list-category")
        })


      }
     
    })


  });
  

module.exports = router;
 