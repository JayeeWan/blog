const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')

app.set('view engine','ejs')

app.set('views','./views')

app.use(bodyParser.urlencoded({extended:false}))

app.use('/node_modules',express.static('./node_modules'))

fs.readdir(path.join(__dirname,'./router'),(err,filenames)=>{
    if(err)return console.log('读取router目录中的路由失败!')
    filename.foreach(fname=>{
        const router = require(path.join(__dirname,'./router',fname))
        app.use(router)
    })
})

app.listen(80,()=>{
    console.log('server running at http://127.0.0.1')
})