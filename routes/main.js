// 主路由文件
// 负责处理首页和照片功能

const express = require('express');
const router = express.Router();

// 这里是模拟的照片数据
// 以后应该换成数据库
const photos = [
  { id: 1, url: '/img/photo1.jpg', title: '威哥和翔翔', category: '生活', comments: [{text: "哇，好帅啊威哥", date: "2025-05-25"}, {text: "翔翔很可爱", date: "2025-05-26"}, {text: "好幸福", date: "2025-05-27"}] },
  { id: 2, url: '/img/photo2.jpg', title: '果果大王', category: '宠物', comments: [{text: "肥美", date: "2025-04-25"}] },
  { id: 3, url: '/img/photo3.jpg', title: '美食分享', category: '美食', comments: [{text: "想再吃柳州了😢", date: "2025-05-20"}] },
  { id: 4, url: '/img/photo4.jpg', title: '城市风光', category: '城市', comments: [{text: "威海太美了，想念辣炒嘎啦", date: "2023-12-16"},{text: "哇，大海好澄澈", date: "2024-01-05"},{text: "威海的老洋房很好看", date: "2024-08-05"}, {text: "威海似乎韩国人很多啊", date: "2024-08-08"}] },
  { id: 5, url: '/img/photo5.jpg', title: '自然风光', category: '自然', comments: [{text: "苏州园林，绿意盎然", date: "2024-06-14"}] },
  { id: 6, url: '/img/photo6.jpg', title: '宠物日常', category: '城市', comments: [{text: "这个国宝太精美了", date: "2024-10-10"},{text: "很好看", date: "2024-10-10"}] }
];

const users = [];

// 首页路由
router.get('/', (req, res) => {
  // 分页功能
  const page = parseInt(req.query.page) || 1;
  const limit = 3; // 每页显示3张照片
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  
  const paginatedPhotos = photos.slice(startIndex, endIndex);
  const totalPages = Math.ceil(photos.length / limit);
  
  // 从照片数据中提取所有分类，并去重
  const categories = [...new Set(photos.map(p => p.category))];
  
  res.render('index', { 
    photos: paginatedPhotos, 
    totalPages, 
    currentPage: page,
    categories
  });
});

/**
 * 照片添加页面
 * @route GET /add
 */
router.get('/add', (req, res) => {
  res.render('add-photo');
});

/**
 * 处理照片添加
 * @route POST /add
 * @todo 实现图片上传功能
 */
router.post('/add', (req, res) => {
  const { title, category } = req.body;
  
  const newPhoto = {
    id: photos.length + 1,
    url: '/img/default.jpg', // 默认图片
    title,
    category,
    comments: []
  };
  
  photos.push(newPhoto);
  res.redirect('/');
});

/**
 * 添加评论
 * @route POST /comment/:id
 */
router.post('/comment/:id', (req, res) => {
  const photoId = parseInt(req.params.id);
  const { comment } = req.body;
  const photo = photos.find(p => p.id === photoId);
  
  if (photo) {
    photo.comments.push({
      text: comment,
      date: new Date().toLocaleDateString('zh-CN')
    });
  }
  
  // 重定向到照片所在的页面
  res.redirect(`/?page=${Math.ceil(photoId / 3)}`);
});

module.exports = router;    