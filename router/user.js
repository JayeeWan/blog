const express = require('express')
const router = express.Router()

// 导入用户相关的处理函数模块
const ctrl = require('../controller/user.js')

// 用户请求的是注册页面
router.get('/register', ctrl.showRegisterPage)

// 用户请求的是登录页面
router.get('/login', ctrl.showLoginPage)

// 要注册新用户了
router.post('/register', ctrl.reg)

// 监听登录请求
router.post('/login', ctrl.login)

// 监听注销请求
router.get('/logout',ctrl.logout)

module.exports = router
