var express = require('express');
const { response } = require('../app');
var router = express.Router();
var adminHelper = require('../helpers/admin-helpers')

/* GET home page. */
router.get('/', function (req, res, next) {
    adminHelper.displayUsers().then((allUsers) => {
        // console.log(allUsers);
        res.render('admin/view-users', { admin: true,a:1, allUsers });

    })


});
router.get('/add-users', function (req, res, next) {
    res.render('admin/add-users', {});
});
router.post('/add-users', function (req, res, next) {
    adminHelper.addUser(req.body).then((response) => {
        //console.log(response);
        res.redirect('/admin/add-users')
    })
})
router.get('/admin-login',function(req,res,next){
    res.render('admin/admin-login',{})
})
router.post('/admin-login',function(req,res,next){
    // console.log(req.body);
    adminHelper.adminLogin(req.body).then((response)=>{
        if(response.status){
            res.redirect('/admin')
        }else{
            res.redirect('/admin/admin-login')
        }

    })

})
router.get('/admin-signup',function(req,res,next){
    res.render('admin/admin-signup',{})
})
router.post('/admin-signup',function(req,res,next){
    console.log(req.body);
    adminHelper.addAdmin(req.body).then((response)=>{
        res.redirect('/admin/admin-login')
    })
})
router.get('/view-users', function (req, res, next) {
    res.redirect('/admin');
});
router.get('/delete-product/:email',function(req,res){
    let userMail=req.params.email
    console.log(userMail)
    adminHelper.deleteUser(userMail).then((response)=>{
        res.redirect('/admin')
    })

})



module.exports = router;
