[![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
## Mesto: фото-лента [backend]

### :gear: О чем проект
[**Этот проект**](https://github.com/naborbukovok/express-mesto-gha) - одна из домашних работ по курсу ["Веб-разработчик"](https://practicum.yandex.ru/web/) от сервиса Яндекс Практикум. Проект содержит бэкенд веб-сервиса **Mesto** - соцсети для обмена фотографиями интересных мест. Пользователи могут управлять данными своего профиля, публиковать и оценивать посты с фотографиями. Реализованы следующие роуты:

- **Регистрация и авторизация** <br/>
`POST /signup` - создание нового пользователя <br/>
`POST /signin` - вход существующего пользователя

- **Работа с пользователями** <br/>
`GET /users` - получение всех пользователей <br/>
`GET /users/:userId` - получение пользователя с ID `userId` <br/>
`GET /users/me` - получение текущего пользователя <br/>
`PATCH /users/me` - обновление информации о текущем пользователе <br/>
`PATCH /users/me/avatar` - обновление аватара текущего пользователя

- **Работа с карточками** <br/>
`GET /cards` - получение всех карточек <br/>
`POST /cards` - создание карточки <br/>
`DELETE /cards/:cardId` - удаление карточки c ID `cardId` <br/>
`PUT /cards/:cardId/likes` - постановка лайка на карточку c ID `cardId` <br/>
`DELETE /cards/:cardId/likes` - снятие лайка с карточки с ID `cardId`

Роуты для работы с пользователями и карточками защищены авторизацией.

### :gear: Запуск проекта
`npm run start` - запускает сервер.<br/>
`npm run dev` - запускает сервер с hot-reload.

### :gear: Стек технологий
<img src="https://img.shields.io/badge/npm-CB3837?style=flat&logo=npm&logoColor=white"/> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=white"/> <img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white"/> <img src="https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white"/> <img src="https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white"/> <img src="https://img.shields.io/badge/mongoose-880000?style=flat&logo=mongoose&logoColor=white"/>
