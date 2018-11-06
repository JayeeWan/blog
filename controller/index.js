const conn = require('../db/index.js')

// 展示首页页面
const showIndexPage = (req, res) => {
    const pagesize = 3
    const nowpage = Number(req.query.page) || 1
    console.log(nowpage)

    const sql = `select articles.id, articles.title, articles.ctime, users.nickname 
    from articles 
    LEFT JOIN users 
    ON articles.authorId=users.id
    ORDER BY articles.id desc limit ${(nowpage - 1) * pagesize}, ${pagesize};
    select count(*) as count from articles`

    conn.query(sql, (err, result) => {
        if (err) {
            return res.render('index.ejs', {
                user: req.session.user,
                islogin: req.session.islogin,
                article: []
            })
        }

        const totalPage = Math.ceil(result[1][0].counnt / pagesize)

        // 使用render函数之前,一定要保证安装和配置了ejs模板引擎
        res.render("index.ejs", {
            user: req.session.user,
            islogin: req.session.islogin,
            article: result[0],
            totalPage: totalPage,
            nowpage: nowpage
        })
    })
}
module.exports = {
    showIndexPage
}
