var db = require('../configurations/connection')
var bcrypt = require('bcrypt')
const { response } = require('../app')
module.exports = {
    addUser: (user) => {
        return new Promise(async (resolve, reject) => {
            user.password = await bcrypt.hash(user.password, 10)
            db.get().collection('users').insertOne(user).then((req, res) => {

                // passing the success result
                resolve(user)

            })

        })
    },
    displayUsers: () => {
        return new Promise(async (resolve, reject) => {
            let allUsers = await db.get().collection('users').find().toArray()
            resolve(allUsers)
        })
    },
    addAdmin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            data.password=await bcrypt.hash(data.password,10)
            db.get().collection('admin').insertOne(data).then((req,res)=>{
                resolve(data)
            })

        })

    },
    adminLogin:(data)=>{
        return new Promise(async(resolve,reject)=>{
            let loginstatus=false
            let response={}
            let admin=await db.get().collection('admin').findOne({email:data.email})
            if(admin){
                bcrypt.compare(data.password,admin.password).then((status)=>{
                    if(status){
                        console.log('success');
                        response.user=admin
                        response.status=true
                        resolve(response)
                    }else{
                        console.log('denied');
                        resolve({status:false})
                    }
                })

            }else{
                console.log('no user wxists')
                resolve({status:false})

            }
        })
    
    },
    deleteUser:(data)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection('users').deleteOne({email:data}).then((req,res)=>{
                console.log("delete worked");
                resolve(response)
            })
        })
    }
    

}