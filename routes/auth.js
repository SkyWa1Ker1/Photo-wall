/**
 * 用户认证路由
 * 处理登录、注册和登出功能
 */

const express = require('express');
const router = express.Router();

// 模拟用户数据库
const users = [];

/**
 * 登录页面
 * @route GET /auth/login
 */
router.get('/login', (req, res) => {
  res.render('auth/login', { error: null });
});

/**
 * 处理登录请求
 * @route POST /auth/login
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // 登录成功，存储用户信息到会话
    req.session.user = user;
    res.redirect('/');
  } else {
    // 登录失败，返回错误信息
    res.render('auth/login', { error: '用户名或密码错误' });
  }
});

/**
 * 注册页面
 * @route GET /auth/register
 */
router.get('/register', (req, res) => {
  res.render('auth/register', { error: null });
});

/**
 * 处理注册请求
 * @route POST /auth/register
 * @todo 加入密码加密功能
 */
router.post('/register', (req, res) => {
  const { username, password, confirmPassword } = req.body;
  
  // 验证两次输入的密码是否一致
  if (password !== confirmPassword) {
    res.render('auth/register', { error: '两次输入的密码不一致' });
    return;
  }
  
  // 检查用户名是否已存在
  if (users.find(u => u.username === username)) {
    res.render('auth/register', { error: '用户名已存在' });
    return;
  }
  
  // 创建新用户
  const newUser = {
    id: users.length + 1,
    username,
    password  // 注意：实际应用中应该加密存储
  };
  
  users.push(newUser);
  res.redirect('/auth/login');
});

/**
 * 登出
 * @route GET /auth/logout
 */
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = router;