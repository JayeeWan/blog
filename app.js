const express = require('express')
const fs = require('fs')
const path = require('path')
const app = express()
const bodyParser = require('body-parser')
// 导入session中间件
const session = require('express-session')

// 注册session中间件
// 只要注册了session中间件,那么今后只要能访问到req对象,必然能访问到req.session
app.use(
    session({
        secret:'这是加密の秘钥',
        resave:false,
        saveUninitialized:false
    })
)

// 设置默认采用的模板引擎名称
app.set('view engine', 'ejs')

// 设置模板页面的存放路径
app.set('views', './views')

// 注册解析表单数据的中间件
app.use(bodyParser.urlencoded({ extended: false }))

// 把node_modules文件夹,托管为静态资源目录
app.use('/node_modules', express.static('./node_modules'))

// 使用循环的方式,进行路由的自动注册
fs.readdir(path.join(__dirname, './router'), (err, filenames) => {
    if (err) return console.log('读取router目录中的路由失败!')
    // 循环router目录下的每一个文件名
    filenames.forEach(fname => {
        // 每循环一次,拼接出一个完整的路由模块地址
        // 然后使用require导入这个路由模块
        const router = require(path.join(__dirname, './router', fname))
        app.use(router)
    })
})

app.listen(8888, () => {
    console.log('server running at http://127.0.0.1:8888')
})