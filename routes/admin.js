var express = require('express');
const { Db } = require('mongodb');
const { response } = require('../app');
var router = express.Router();
var db = require('../configurations/connection')
var adminHelper = require('../helpers/admin-helpers')

/* GET home page. */
router.get('/', function (req, res, next) {
    adminHelper.displayUsers().then((allUsers) => {
        let adminsession = req.session.admin
        // console.log(admin);
        // console.log(allUsers);
        if (adminsession) {
            res.render('admin/view-users', { admin: true, allUsers, adminsession });
        } else {
            res.redirect('/admin/admin-login')
        }

    })


});
router.get('/add-users', function (req, res, next) {
    let adminsession = req.session.admin
    res.render('admin/add-users', { adduserError: req.session.adduserError, admin: true, adminsession });
    req.session.adduserError = false
});
router.post('/add-users', function (req, res, next) {
    adminHelper.addUser(req.body).then((response) => {
        console.log(response);
        if (response) {
            res.redirect('/admin')

        } else {
            req.session.adduserError = true
            res.redirect('/admin/add-users')


        }


    })
})
router.get('/admin-login', function (req, res, next) {
    let admin = req.session.admin
    if (admin) {
        res.redirect('/admin')

    } else {

        res.render('admin/admin-login', { admin: true, adminLoginError: req.session.adminLoginError })
        req.session.adminLoginError = false
    }
})
router.post('/admin-login', function (req, res, next) {
    // console.log(req.body);
    adminHelper.adminLogin(req.body).then((response) => {
        if (response.status) {
            req.session.loggedIn = true
            req.session.admin = response.user
            // console.log(req.session.user);
            res.redirect('/admin')
        } else {
            req.session.adminLoginError = true
            res.redirect('/admin/admin-login')
        }

    })

})
router.get('/admin-signup', function (req, res, next) {
    let adminsession = req.session.admin
    res.render('admin/admin-signup', { admin: true, addadminError: req.session.addadminError, adminsession })
    req.session.addadminError = false
})
router.post('/admin-signup', function (req, res, next) {
    console.log(req.body);
    adminHelper.addAdmin(req.body).then((response) => {
        if (response) {
            res.redirect('/admin/admin-login')

        } else {
            req.session.addadminError = true
            res.redirect('/admin/admin-signup')

        }

    })
})
// provides route for the button ('go to admin panel') in (edit user, add user pages)
router.get('/view-users', function (req, res, next) {
    res.redirect('/admin');
});
router.get('/delete-user/:email', function (req, res) {
    let userMail = req.params.email
    console.log(userMail)
    adminHelper.deleteUser(userMail).then((response) => {
        res.redirect('/admin')
    })

})
router.get('/edit-user/:email', async (req, res) => {
    let adminsession = req.session.admin

    let userMail = req.params.email
    console.log(req.params.email);
    // this user is passed to edit page to set value fields
    let user = await db.get().collection('users').findOne({ email: userMail })
    console.log(user);

    res.render('admin/edit-user', { user, admin: true, adminsession })

})
router.post('/edit-user/:email', (req, res) => {
    adminHelper.editUser(req.body).then((response) => {
        res.redirect('/admin')

    })
})

router.get('/admin-logout', (req, res) => {
    // req.session.destroy(() => {
    req.session.admin = null
    res.redirect('/admin/admin-login')


    // })

})



module.exports = router;
