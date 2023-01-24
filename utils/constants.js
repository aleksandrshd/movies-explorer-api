const httpStatusCodes = {
  created: 201,
  badRequest: 400,
  unauthorized: 401,
  forbidden: 403,
  notFound: 404,
  conflict: 409,
  internalServerError: 500,
};

const urlRegEx = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;

const messages = {
  movieCreateInvData: 'Переданы некорректные данные при создании фильма.',
  movieIdNotFound: 'Фильм c указанным id не найден!',
  movieDeleted: 'Фильм удалён из избранного',
  movieDeletionForbidden: 'Удаление фильмов, добавленных другими пользователями запрещено!',
  movieInvalidId: 'Передан некорректный id фильма!',
  userCreateInvData: 'Переданы некорректные данные при создании пользователя.',
  userEmailAlreadyExist: 'Пользователь с указанным email уже зарегестрирован!',
  userIdNotFound: 'Пользователь не найден!',
  userPatchInvData: 'Переданы некорректные данные при обновлении профиля.',
  userInvEmailOrPassword: 'Введены некорректные почта или пароль!',
  userInvalidId: 'Передан некорректный id пользователя!',
};

module.exports = { httpStatusCodes, urlRegEx, messages };
