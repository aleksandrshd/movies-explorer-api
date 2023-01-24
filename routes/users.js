const router = require('express').Router();

const { validateUpdateUser } = require('../utils/validation');

const {
  updateUser, getCurrentUserInfo,
} = require('../controllers/users');

router.get('/me', getCurrentUserInfo);

router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;
