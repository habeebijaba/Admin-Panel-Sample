var db = require('../configurations/connection');
var bcrypt = require('bcrypt');
module.exports = {
    signUp: (data) => {
        return new Promise(async (resolve, reject) => {
            data.password = await bcrypt.hash(data.password, 10)
            console.log(data.password);
            db.get().collection('users').insertOne(data).then((req, res) => {
                resolve(data)
            })

        })
    },
    login: (data) => {
        return new Promise(async (resolve, reject) => {
            let loginstatus = false
            let response = {}
            let user = await db.get().collection('users').findOne({ email: data.email })
            // console.log(user.password);
            // console.log(data.password);
            if (user) {
                bcrypt.compare(data.password, user.password).then((status) => {
                    if (status) {
                        console.log('success');
                        response.user = user;
                        response.status = true;
                        resolve(response)
                    } else {
                        console.log('failed');
                        resolve({ status: false })
                    }
                })

            } else {
                console.log('no user');
                resolve({ status: false })
            }

        })
    }
}