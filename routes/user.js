var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize")
var Op = Sequelize.Op

var userModel = require("../models").User

/* GET home page. */
router.get('/admin/add-user', function(req, res, next) {
  res.render('admin/add-user');
});

router.get('/admin/list-user', async function(req, res, next) {
    
  var users = await userModel.findAll()
  
  res.render('admin/list-user',{
    users:users
  });
  
});

router.post('/admin/add-user',function(req,res,next){

userModel.findOne({
  where:{
    email:{
      [Op.eq]:req.body.email
    }
  }
}).then(user=>{
  if(user){
    req.flash('error',"User with that email already exists")
    res.redirect("/admin/add-user")
  }else{

    userModel.create({
      name:req.body.name,
      email:req.body.email,
      mobile:req.body.mobile,
      gender:req.body.dd_gender,
      address:req.body.address,
      status:req.body.status

    }).then(data=>{
      if(data){
        req.flash('success',"User successfully created")
        res.redirect("/admin/add-user")


      }else{
        req.flash('error',"Failed to create user")
    res.redirect("/admin/add-user")
      }
    })
  }
})

})


router.post('/admin/edit-user/:userId', async function(req, res, next) {

    userModel.update({
      name:req.body.name,
      email:req.body.email,
      mobile:req.body.mobile,
      gender:req.body.dd_gender,
      address:req.body.address,
      status:req.body.status

    },{
      where:{
        id:{
          [Op.eq]:req.params.userId
        }
      }
    }).then(data=>{
      if(data){
        req.flash('success',"User successfully updated")
        res.redirect("/admin/edit-user/"+req.params.userId)


      }else{
        req.flash('error',"Failed to update user")
        res.redirect("/admin/edit-user/"+req.params.userId)      }
    })
  });



router.get('/admin/edit-user/:userId',async function(req, res, next) {
      var user = await userModel.findOne({
        where:{
          id:{
            [Op.eq]:req.params.userId
          }
        }
      })
      
      res.render('admin/edit-user',{
        user:user
      })
      
   
    

  });


router.post('/admin/delete-user/:userId',function(req,res,next){
  userModel.findOne({
    where:{
      id:{
        [Op.eq]:req.params.userId
      }
    }
  }).then(data=>{
    if(data){
      userModel.destroy({
        where:{
          id:{
            [Op.eq]:req.params.userId
          }
        }
      }).then(status=>{
        if(status){
          req.flash("success","User has been deleted")
          res.redirect("/admin/list-user")
        }else{
          req.flash("error","Failed to delete user")
          res.redirect("/admin/list-user")
        }
      })
    }else{
      req.flash("error","Failed to delete user")
      res.redirect("/admin/list-user")
    }
  })

  
})


module.exports = router;
 