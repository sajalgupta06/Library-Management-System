var express = require('express');
var router = express.Router();
var Sequelize = require("sequelize")
var Op = Sequelize.Op

var optionModel = require("../models").Option
var daysModel = require("../models").DaySetting

/* GET home page. */
router.get('/admin/currency-settings', async function(req, res, next) {
  
  var currency_data = await optionModel.findOne({
    where:{
      option_name:{
        [Op.eq]:"active_currency"
      }
    }
  })
  
  res.render('admin/currency-settings',{
    currency_data:currency_data
  });
});

router.post('/admin/currency-settings', function(req, res, next) {
 
  optionModel.findOne({
    where:{
      option_name:{
        [Op.eq]:"active_currency"
      }
    }
  }).then(data=>{
    if(data){
      optionModel.update({
        option_value:req.body.dd_currency

      },{
        where:{
          option_name:{
            [Op.eq]:"active_currency"
          }
        }
      }).then(status=>{
        if(status){
          req.flash("success","Currency settings updated")
        }else{
          req.flash("error","Failed to update currency")
          
        }
        res.redirect("/admin/currency-settings")
      })

    }else{
      optionModel.create({
        option_name:"active_currency",
        option_value: req.body.dd_currency
      }).then(status=>{
        if(status){
          req.flash("success","Currency settings saved")
        }else{
          req.flash("error","Failed to save currency")
          
        } 
        res.redirect("/admin/currency-settings")
      })

    }
  })
});

router.get('/admin/day-settings', async function(req, res, next) {
  
  var days= await daysModel.findAll();

  
  res.render('admin/day-settings',{
    days:days
  })
})

router.post('/admin/day-settings', function(req, res, next) {
    
  daysModel.findOne({
    where:{
      total_days:{
        [Op.eq]:req.body.days_count
      }
    }
  }).then(data=>{
    if(data){

      req.flash("error","Day already exists");
      res.redirect('/admin/day-settings')
    }else{

        daysModel.create({
          total_days:req.body.days_count
        }).then(status=>{
          if(status){
            req.flash("success","Day has been saved");

          }else{
            req.flash("error","Failed to save day");

          }
          res.redirect('/admin/day-settings')

        })
    }
  })
    
  });
  

  router.post('/admin/delete-days/:dayId',function(req, res, next) {
  
  daysModel.destroy({
    where:{
      id:{
        [Op.eq]:req.params.dayId
      }
    }
  }).then(data=>{
    if(data){
      req.flash("success","Day has been deleted")
    }else{
      req.flash("error","Failed to delete day")

    }
    res.redirect("/admin/day-settings")
  })
 

  })

module.exports = router;
