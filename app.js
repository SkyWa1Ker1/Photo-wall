// 这是照片墙项目的主文件
// 做了登录和照片展示功能
// 作者：威哥
// 开始日期：2023年1月15日

const express = require('express');
const session = require('express-session');
const path = require('path');
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/main'); 

const app = express();  // 创建应用实例

// 设置session，这样用户登录后就能记住状态
app.use(session({
  secret: 'your-secret-key', // 这个是加密密钥，之后可能要改
  resave: false,
  saveUninitialized: true,
  cookie: { 
    maxAge: 1000 * 60 * 60 * 24, // 这个是cookie过期时间，设置为一天
    secure: process.env.NODE_ENV === 'production' // 生产环境下才设为true
  }
}));

// 视图引擎设置
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 静态资源，比如css和图片
app.use(express.static(path.join(__dirname, 'public')));

// 请求解析器，不知道为啥要两个
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 这里是用户认证的中间件
// 把用户信息放到locals里，这样模板就能用了
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// 路由注册
app.use('/auth', authRoutes);  // 认证相关的路由
app.use('/', mainRoutes);      // 主页相关的路由

// 启动服务
const PORT = process.env.PORT || 3000;  // 端口号，默认3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`访问 http://localhost:${PORT} 查看网站`);
});    