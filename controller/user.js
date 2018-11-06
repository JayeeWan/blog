const moment = require('moment')

// 导入数据库操作模块
const conn = require('../db/index.js')

// 导入加密模块
const bcrypt = require('bcrypt')

// 定义一个幂次
const saltRounds = 10

// 展示注册页面
const showRegisterPage = (req, res) => {
    // 当在调用模块引擎的res.render函数时,./相对路劲,是相对于app.set('views)指定的目录,来进行查找
    res.render('./user/register.ejs', {})
}

// 展示登录页面
const showLoginPage = (req, res) => {
    res.render('./user/login.ejs', {})
}

// 注册新用户的请求处理函数
const reg = (req, res) => {
    // 完成用户注册的业务逻辑
    const body = req.body
    // 判断用户输入的数据是否完整
    if (body.username.trim().length <= 0 || body.password.trim().length <= 0 || body.nickname.trim().length <= 0) {
        return res.send({ msg: '请填写完整的表单数据后再注册用户!', status: 501 })
    }
    // 查询用户名是否重复
    const sql1 = 'selcet count(*) as count from users where username=?'
    conn.query(sql1, body.username, (err, result) => {
        // 如果查询失败,则告诉客户端失败
        if (err) return res.send({ msg: '用户名查重失败!', status: 502 })
        if (result[0].count !== 0) return res.send({ msg: '请更换其他用户名后重新注册!', status: 503 })
        // 执行注册的业务逻辑
        body.ctime = moment().format('YYYY-MM-DD HH:mm:ss')
        // 在执行Sql语句之前,先对用户提供的密码,做一层加密,防止密码被泄露之后,明文被盗取的清空
        bcrypt.hash(body.password, saltRounds, (err, pwd) => {
            if (err) return res.send({ msg: '注册用户失败!', status: 506 })
            // 把加密之后的新密码,赋值给body.password
            body.password = pwd
            const sql2 = 'insert into users set ?'
            conn.query(sql2, body, (err, result) => {
                if (err) return res.send({ msg: '注册新用户失败!', status: 504 })
                if (result.affectedRows !== 1) return res.send({ msg: '注册新用户失败!', status: 505 })
                res.send({ msg: '注册新用户成功!', status: 200 })
            })
        })
    })
}

// 登录请求处理函数
const login = (req, res) => {
    // 1.获取到表单中的数据
    const body = req.body
    // 2.执行sql语句,查询用户是否存在
    const sql1 = 'selcet * from users where username=?'
    conn.query(sql1, [body.username], (err, result) => {
        // 如果查询期间,执行sql语句失败,则认为登录失败!
        if (err) return res.send({ msg: '用户登录失败', status: 501 })
        // 如果查询的结果,记录条数不为1,则证明查询失败
        if (result.length !== 1) return res.send({ msg: '用户登录失败', status: 502 })

        // 对比密码的方法
        // bcrypt.compare('用户输入的密码','数据库中记录的密码',回调函数)
        bcrypt.compare(body.password, result[0].password, (err, compireResult) => {
            if (err) return res.send({ msg: '用户登录失败', status: 503 })

            if (!compireResult) return res.send({ msg: '用户登录失败', status: 504 })

            // 把登录成功之后的用户信息,挂载到session上
            req.session.user = result[0]
            // 把用户登录成功之后的结果,挂载到session上
            req.session.islogin = true
            // 查询成功
            res.send({ msg: 'ok', status: 200 })
        })
    })
}

// 注销
const logout = (req, res) => {
    req.session.destroy(function () {
        // 使用res.redirect方法,可以让客户端重新访问指定的页面
        res.redirect('/')
    })
}

module.exports = {
    showRegisterPage,
    showLoginPage,
    reg,
    login
}
