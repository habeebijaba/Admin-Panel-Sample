var express = require('express');
const { Db } = require('mongodb');
const { response } = require('../app');
var router = express.Router();
var db = require('../configurations/connection')
var adminHelper = require('../helpers/admin-helpers')

/* GET home page. */
router.get('/', function (req, res, next) {
    adminHelper.displayUsers().then((allUsers) => {
        // console.log(allUsers);
        res.render('admin/view-users', { admin: true, allUsers });

    })


});
// can i replace by redirecting to user signup(question)

router.get('/add-users', function (req, res, next) {
    res.render('admin/add-users', {admin:true});
});
router.post('/add-users', function (req, res, next) {
    adminHelper.addUser(req.body).then((response) => {
        //console.log(response);
        res.redirect('/admin/add-users')
    })
})
router.get('/admin-login',function(req,res,next){
    res.render('admin/admin-login',{admin:true})
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
    res.render('admin/admin-signup',{admin:true})
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
router.get('/delete-user/:email',function(req,res){
    let userMail=req.params.email
    console.log(userMail)
    adminHelper.deleteUser(userMail).then((response)=>{
        res.redirect('/admin')
    })

})
router.get('/edit-user/:email',async(req,res)=>{
    let userMail=req.params.email
    console.log(req.params.email);
    let user=await db.get().collection('users').findOne({email:userMail})
    console.log(user);
    //provide get method only,post method same as add-users
    res.render('admin/edit-user',{user,admin:true})

})



module.exports = router;
