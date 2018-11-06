const express = require('express')

const router = express.Router()

const ctrl = require('../controller/article.js')

// 监听客户端的get请求地址,显示文章添加页面
router.get('/article/add',ctrl.showAddArticlePage)

// 监听客户端发表文章的请求
router.post('/article/add',ctrl.addArticle)

// 监听客户端请求文章编辑页面
router.get('/article/info/:id',ctrl.showArticleDetail)

// 用户编辑文章
router.get('/article/edit/:id',ctrl.editArticle)

module.exports = router
