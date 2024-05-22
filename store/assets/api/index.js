/* global fetch, FormData */
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const SYSTEM_ERROR_MESSAGE =
  'Извините, во время работы системы произошла ошибка. Попробуйте позже.';
const AUTH_ERROR_MESSAGE =
  'Не удалось авторизоваться в системе. Проверьте введенные данные.';
const RESET_ERROR_MESSAGE =
  'Не удалось отправить письмо для восстановления пароля. Пожалуйста, проверьте введенные данные.';
const DISCONNECT_ERROR_MESSAGE =
  'Нет соединения. Проверьте подключение к интернету';

const objToString = (data = {}) =>
  Object.keys(data)
    .filter(key => data[key] || typeof data[key] === 'number')
    .map(key => {
      const value = data[key];

      if (Array.isArray(value)) {
        return `${key}: [${value.join(', ')}]`;
      }

      if (!Number.isNaN(Number(value))) {
        return `${key}: ${value}`;
      }

      return `${key}: "${value}"`;
    })
    .join(', ');

const removeMimeTypeFromBase64 = str => {
  if (str.slice(0, 5) === 'data:') {
    return str.split(',')[1];
  }

  return str;
};

const send = ({
  method = 'POST',
  contentType = 'application/graphql',
  token = '',
  queryParams = '',
  urlParams = '/index.php',
  body = '',
}) => {
  const options = {
    method,
    headers: {},
    body,
  };

  if (contentType) {
    options.headers['Content-Type'] = contentType;
  }

  if (method === 'GET') {
    delete options.body;
  }

  // options.headers['Auth-token'] = token;
  if (token) {
    options.headers.Authorization = `Bearer ${token}`;
  }

  return (
    fetch(
      `${process.env.EXPO_PUBLIC_API_URL || ''}${urlParams}?${queryParams}`,
      options,
    )
      // если зафейлится fetch
      .catch(({message}) =>
        Promise.reject([{message: DISCONNECT_ERROR_MESSAGE}]),
      )
      .then(response =>
        response
          .json()
          .then(json => ({response, json}))
          .catch(() => ({response, json: null})),
      )
      .then(({response, json}) => {
        if (json && !json.errors && response.status < 400) {
          return json;
        }

        // ошибки, которые приходят с бекенда
        if (json && json.message) {
          return Promise.reject([{message: json.message}]);
        }

        // GraphQL ошибки
        if (json && Array.isArray(json.errors)) {
          return Promise.reject(
            json.errors
              .map(({message}) => ({
                message:
                  IS_PRODUCTION && message ? SYSTEM_ERROR_MESSAGE : message,
              }))
              .filter(({message}) => message),
          );
        }

        let message = IS_PRODUCTION
          ? SYSTEM_ERROR_MESSAGE
          : response.statusText;

        if (response.status >= 500) {
          message = SYSTEM_ERROR_MESSAGE;
        }

        return Promise.reject([{message}]);
      })
  );
};

const fetchDict = (name, additionalParams) => () =>
  send({
    name,
    queryParams: 'fake=di',
    body: `{
    getDictionaries {
      ${name}
      {
        id,
        name,
        projects,
        section,
        icon,
        sectionName,
        ${Array.isArray(additionalParams) ? additionalParams.join(',') : ''}
      }
    }
  }`,
  });

export const auth = (token, {login, password}) => {
  const data = new FormData();

  data.append('login', login);
  data.append('password', password);

  return send({
    token,
    contentType: null,
    queryParams: 'r=sign/in',
    body: data,
  }).then(response =>
    response.signin
      ? Promise.resolve(response)
      : Promise.reject([
          {
            message: AUTH_ERROR_MESSAGE,
          },
        ]),
  );
};

export const logout = token =>
  send({
    method: 'GET',
    token,
    queryParams: 'r=sign/out',
  }).then(res => (!res ? Promise.reject() : Promise.resolve(res)));

export const checkAuth = token => {
  if (!token) {
    return Promise.reject([
      {
        message: '',
      },
    ]);
  }
  return send({
    method: 'GET',
    token,
    queryParams: 'r=site/auth',
  }).then(response =>
    response.signin
      ? Promise.resolve(response)
      : Promise.reject([
          {
            message: '',
          },
        ]),
  );
};

export const resetPassword = (token, data) =>
  send({
    token,
    queryParams: 'r=reset-new-password',
    body: `mutation {
    resetNewPassword(${
      data.login ? `login: "${data.login}"` : `email: "${data.email}"`
    })
  }`,
  }).then(res =>
    !res || !res.data.resetNewPassword
      ? Promise.reject([
          {
            message: RESET_ERROR_MESSAGE,
          },
        ])
      : Promise.resolve(res),
  );

export const changePassword = (token, {password, newPassword}) =>
  send({
    token,
    body: `mutation {
    updatePasswordProfile(oldPassword: "${password}", newPassword: "${newPassword}")
  }`,
  });

export const editProfile = (token, {fileName, fileContent}) =>
  send({
    token,
    body: `mutation {
  editProfile(
    avatar : {
      fileName: ${fileName ? `"${fileName}"` : null},
      fileContent: ${fileContent ? `"${fileContent}"` : null}
    }
)}`,
  });

export const editProfilePushNotifcations = (token, {enablePush, fcmToken}) =>
  send({
    token,
    body: `mutation {
    editProfile(getPushNotification: ${enablePush}, userAppToken: "${fcmToken}")
  }`,
  });

export const fetchProfile = token =>
  send({
    token,
    body: `{
    profile {
      fio,
      phoneNumber,
      email,
      avatar,
      enablePush
    }
  }`,
  });

export const fetchProjects = token =>
  send({
    token,
    // urlParams: '/projects',
    body: `{
    getRealEstate {
      projectId,
      rooms {
        roomId,
        room
      },
      contacts {
        contactPerson,
        phoneNumber,
        schedule,
        email
      },
      previewPicture,
      projectName,
      address
    }
  }`,
  });

export const fetchDocs = (token, {projectId}) =>
  send({
    token,
    // urlParams: '/docs/index.php',
    body: `{
    getDocumentsOnProjectId(projectId: ${projectId}) {
      projectId,

      documents {
          sectionId,
          sectionName,
          fileLink,
          fileName
        }
      }
  }`,
  });

export const fetchRoom = (token, {roomId}) =>
  send({
    token,
    // urlParams: '/rooms/index.php',
    body: `{
    getInformationOnRoom(roomId: ${roomId}) {
      roomId,
      projectId,
      previewPicture,
      room,
      houseroom,
      address,
      projectName,
      debt,
      contacts {
          contactPerson,
          phoneNumber,
          schedule,
          email
        }
    }
  }`,
  });
// ex fetchRooms
export const fetchRoomsForProject = (token, {projectId}) =>
  send({
    token,
    // urlParams: '/rooms/index.php',
    body: `{
      getRoomsForProject(projectId: ${projectId}) {
      roomId,
      room
    }
  }`,
  });

export const fetchAllRooms = (token, {projectId}) =>
  send({
    token,
    // urlParams: '/rooms/index.php',
    body: `{
    getRooms(projectId: ${projectId}){
        roomId,
        projectId,
        previewPicture,
        room,
        houseroom,
        address,
        projectName,
        debt,
        contacts{
            contactPerson,
            phoneNumber,
            schedule,
            email
        }
    }
}`,
  });

export const fetchNews = (token, {newsId}) =>
  send({
    token,
    queryParams: 'fake=news',
    body: `{
    getNews(newsId: ${newsId}) {
      news {
        previewPicture,
        text
      }
    }
  }`,
  });

export const fetchAllNews = (token, {page = 0, size = 10} = {}) =>
  send({
    token,
    queryParams: 'fake=news',
    body: `{
    getNews(pageNumber: ${page}, pageSize: ${size}) {
      news {
        title,
        newsId,
        createdAt,
        previewPicture
      },

      pagingOptions {
        pageTotal,
        total
      }
    }
  }`,
  }).then(res => ({...res, page, size}));

export const updateNotification = (token, {notificationId} = {}) =>
  send({
    token,
    // urlParams: '/notification',
    body: `mutation {
    updateVisitStatus(notificationId: ${notificationId}, isVisited: true)
  }`,
  });

export const fetchNotifications = (
  token,
  {page = 0, size = 10, status, showAll = false} = {},
) =>
  send({
    token,
    // urlParams: '/notification',
    body: `{
    getNotifications(pageNumber: ${page}, pageSize: ${size}, showAll: ${showAll}, ${objToString(
      {status},
    )}) {
      notification {
        notificationId,
        title,
        createdAt,
        isVisited,

        event {
          eventId,
          eventTypeId,
          statusName
        },

        bill {
          billId,
          date,
          description,
          fileLink
        }
      },

      pagingOptions {
        pageTotal,
        total,
        unreadTotal
      }
    }
  }`,
  }).then(res => ({...res, page, size}));

export const fetchServices = (token, {projectId}) =>
  send({
    token,
    // urlParams: '/service/index.php',
    body: `{
    getServices(projectId: ${projectId}) {
      projectId,

      services {
        sectionId,
        sectionName,
        fileLink,
        fileName
      }
    }
  }`,
  });

// TODO: проверить
export const sendComment = (token, {eventId, text, files}) =>
  send({
    token,
    queryParams: 'fake=news',
    body: `mutation {
    postComment(
        ${eventId ? `eventId: ${eventId},` : ''}

        comment: {
          ${text ? `text: "${text}",` : ''}

          ${
            files
              ? `attachedFile: [
            ${files
              .map(
                ({fileName, fileContent}) => `
              {
                fileName: "${fileName}",
                fileContent: "${removeMimeTypeFromBase64(fileContent)}"
              }
            `,
              )
              .join(',')}
          ]`
              : ''
          }
        }
    ) {
      avatar,
      userName,
      userPatronymic,
      userSurname,
      createdAt,
      text,

      file {
        fileName,
        fileLink
      }
    }
  }`,
  });

// commentNews('', { eventId: 84, text: 'Комментарий' });

// TODO: проверить
export const fetchBill = (token, {billId}) =>
  send({
    token,
    // urlParams: '/bills/index.php',
    body: `{
    getBill(billId: ${billId}) {
      billId,
      fileLink,
      date,
      receiptNumber,
      paymentReceiptLink,
      total,
      status {
              statusId,
              statusName
            }
      project {
        id,
        title,
        room {
            id,
            title
        }
      }
            billCategory {
                code,
                name
            }

    }
  }`,
  });

// fetchBill('', { billId: 1 });

// TODO: пробрасывать дату и статус
export const fetchBills = (
  token,
  {statusId, startAt, endAt, page, size = 4, projects, categoryId},
) =>
  send({
    token,
    // urlParams: '/bills/index.php',
    body: `{
    getBills(
        filter: {
            ${
              projects
                ? `projects:[
        ${projects.map(
          ({id = 0, roomId}) => `{ ${objToString({id, roomId})} }, `,
        )}
    ], `
                : ''
            }
    ${objToString({
      startAt,
      endAt,
      categoryId,
      statusId,
    })}
        },
        pagingOptions: {
            pageNumber: ${page},
            pageSize: ${size}
        }
    )
    {
        bills {
            billId,
            date,
            receiptNumber,
            paymentReceiptLink,
            total,
            status {
                statusId,
                statusName
            }
            project {
                id,
                title,
                room {
                    id,
                    title
                }
            }
            billCategory {
                code,
                name
            }
        },
        pagingOptions {
            pageNumber,
            pageSize,
            pageTotal,
            total
        }
    }
}`,
  });

export const fetchUtilityBills = (
  token,
  {statusId, startAt, endAt, page, size = 20, projects, categoryId},
) =>
  fetchBills(token, {
    statusId,
    startAt,
    endAt,
    page,
    size,
    projects,
    categoryId,
  });

// pagingOptions {
//   pageTotal
// }

// TODO: пробрасывать все данные
export const sendPass = (
  token,
  {
    eventTypeId,
    roomId,
    projectId,
    dateTime,
    byCar,
    arrivalTypeId,
    deliveryTypeId,
    appealTypeId,
    guests,
    text,
    car,
    attachedFile,
  },
) =>
  send({
    token,
    queryParams: 'fake=event',
    body: `mutation {
    createEventRequest(
      event: {
        ${objToString({
          eventTypeId,
          projectId,
          roomId,
          dateTime,
          byCar,
          arrivalTypeId,
          deliveryTypeId,
          appealTypeId,
        })},

        ${
          guests
            ? `guest: [
          ${guests
            .map(
              ({phoneNumber, name, surname, patronymic}) => `{
            ${phoneNumber ? `phoneNumber: "${phoneNumber}",` : ''}
            ${objToString({
              name,
              surname,
              patronymic,
            })}
          }`,
            )
            .join(',')}
        ],`
            : ''
        }

        additionalComment: {
            text: "${text || ''}"
        },

        ${
          car
            ? `car: {
          ${car.plateNumber ? `plateNumber: "${car.plateNumber}",` : ''}
          ${objToString({
            model: car.model,
            parkingPlaceTypeId: car.parkingPlaceTypeId,
          })}
        },`
            : ''
        }

        ${
          !Array.isArray(attachedFile) && attachedFile
            ? `attachedFile: {
          ${objToString({
            fileName: attachedFile.fileName,
            fileContent: removeMimeTypeFromBase64(attachedFile.fileContent),
          })}
        }`
            : ''
        }

        ${
          Array.isArray(attachedFile) && attachedFile
            ? `attachedFile: [
          ${attachedFile.map(
            ({fileName, fileContent}) => `{
            ${objToString({
              fileName,
              fileContent: removeMimeTypeFromBase64(fileContent),
            })}
          }`,
          )}
        ]`
            : ''
        }

      }
    ) {
        eventId
    }
  }`,
  });

// TODO: прокинуть данные
export const fetchAppealList = (
  token,
  {
    page = 0,
    size = 4,
    eventTypeId,
    eventRelevanceTypeId,
    startAt = '2019-06-09T15:19:21+00:00',
    endAt = '2020-06-11T15:19:21+00:00',
    statusCode,
    appealTypeId,
  },
) =>
  send({
    token,
    queryParams: 'fake=event',
    body: `{
    getEvents(
      pagingOptions: {
        pageNumber: ${page},
        pageSize: ${size}
      },

      filters: {
        ${objToString({
          eventTypeId,
          eventRelevanceTypeId,
          startAt,
          endAt,
          appealTypeId,
        })},

        ${
          Array.isArray(statusCode)
            ? `statusCode: [${statusCode.join(' , ')}]`
            : ''
        }
      }
    ) {
      events {
        eventId,
        eventTypeId,
        eventTypeName,
        eventStatusCode,
        eventStatusName,
        createdAt
      },

      pagingOptions {
        pageTotal,
        pageNumber,
        pageSize
      }
    }
  }`,
  });

// pagingOptions {
//   pageTotal
// }

// TODO: проверить
export const fetchGuestPass = (token, {eventId}) =>
  send({
    token,
    body: `{
    getEvent(eventId: ${eventId}) {
      eventId,
      createdAt,
      statusName,
      eventTypeName,
      projectName,
      dateTime,
      arrivalTypeId,
      arrivalTypeName,

      guest {
        phoneNumber,
        name,
        surname,
        patronymic,
      },

      car {
        plateNumber,
        model,
        parkingPlaceTypeId
      },

      additionalComment {
        text
      },

      comment {
          avatar,
          userName,
          userPatronymic,
          userSurname,
          createdAt,
          text,

          file {
            fileName,
            fileLink
          }
      }
    }
  }`,
  });

// fetchGuestPass('', { eventId: 84 }); // не работает

// TODO: проверить
export const fetchDeliveryPass = (token, {eventId}) =>
  send({
    token,
    body: `{
    getEvent(eventId: ${eventId}) {
      eventId,
      eventTypeId,
      createdAt,
      statusName,
      eventTypeName,
      projectName,
      dateTime,
      deliveryTypeName,
      arrivalTypeId,
      arrivalTypeName,

      guest {
        phoneNumber,
        name,
        surname,
        patronymic
      },

      car {
        plateNumber,
        model
      },

      additionalComment{
        text
      },

      comment {
        avatar,
        userName,
        userPatronymic,
        userSurname,
        createdAt,
        text,

        file {
          fileName,
          fileLink
        }
      }
    }
  }`,
  });

export const fetchTaxiPass = (token, {eventId}) =>
  send({
    token,
    body: `{
    getEvent(eventId: ${eventId}) {
      eventId,
      eventTypeId,
      createdAt,
      statusName,
      eventTypeName,
      projectName,
      dateTime

      guest {
        phoneNumber,
        name,
        surname,
        patronymic
      },

      car {
        plateNumber,
        model
      },

      additionalComment{
        text
      },

      comment {
        avatar,
        userName,
        userPatronymic,
        userSurname,
        createdAt,
        text,

        file {
          fileName,
          fileLink
        }
      }
    }
  }`,
  });

// fetchDeliveryPass('', { eventId: 84 }); // не работает

// TODO: проверить
export const fetchServiceCompanyAppeal = (token, {eventId}) =>
  send({
    token,
    body: `{
    getEvent(eventId: ${eventId}) {
      eventId,
      createdAt,
      statusName,
      eventTypeName,
      appealTypeName,
      projectName,
      additionalComment {
        text
      },

      attachedFile {
        name,
        fileLink,
        previewPicture
      },

      comment {
        avatar,
        userName,
        userPatronymic,
        userSurname,
        createdAt,
        text,

        file {
          fileName,
          fileLink
        }
      }
    }
  }`,
  });

export const fetchEditProfileAppeal = (token, {eventId}) =>
  send({
    token,
    body: `{
    getEvent(eventId: ${eventId}) {
      eventId,
      createdAt,
      statusName,
      eventTypeName,
      dateTime,
      fio,
      email,
      phone,
      additionalComment{
        text
      }
      comment{
        avatar,
        userName,
        userPatronymic,
        userSurname,
        createdAt,
        text,
        file{
          fileName,
          fileLink
        }
      }
    }
  }`,
  });

export const fetchFundsFlow = (
  token,
  {roomId, pageNumber = 0, pageSize = 20},
) =>
  send({
    token,
    body: `
{
  getFundsFlow(
      filter: {
          roomId: ${roomId},
          flowTypeId: [1, 2],
      },
      pagingOptions: {
          pageNumber: ${pageNumber},
          pageSize: ${pageSize},
      }
  )
  {
      flow {
          date,
          total,
          flowType,
          fileLink
      },
      pagingOptions {
          pageNumber,
          pageSize,
          pageTotal,
          total
      }
  }
}
`,
  });

export const fetchBillPaymentLink = (token, {billId}) =>
  send({
    token,
    body: `{
    getBillPayment(billId: ${Number.isInteger(billId) ? billId : null}) {
      paymentLink
    }
  }`,
  });

export const fetchRoomPaymentLink = (token, {roomId, total}) =>
  send({
    token,
    body: `{
    getRoomPayment(
        roomId: ${Number.isInteger(roomId) ? roomId : null},
        total: ${Number(total)}
    ) {paymentLink}
}`,
  });

export const fetchEventStatuses = () =>
  send({
    queryParams: 'fake=di',
    body: `{
    getDictionaries {
      eventStatuses
      {
        id,
        code,
        name
      }
    }
  }`,
  });

export const fetchFundsFlowTypes = () =>
  send({
    queryParams: 'fake=di',
    body: `{
    getDictionaries {
      fundsFlowTypes
      {
        id,
        code,
        name
      }
    }
  }`,
  });

export const fetchConfig = () =>
  send({
    body: `{
    config {
      lastBuild,
      lastBuildDescription,
      googlePlayLink,
      appStoreLink
    }
  }`,
  });

const PROFILE_TYPE_ID = 5;

export const editProfileRequest = (
  token,
  {eventTypeId = PROFILE_TYPE_ID, fio, phone, email},
) =>
  send({
    token,
    queryParams: 'fake=event',
    body: `mutation {
    createEventRequest(
      event: {
        ${objToString({
          eventTypeId,
          fio,
          phone,
          email,
        })}
      }
    ) {
      eventId
    }
  }`,
  });

export const editAppealRelevance = (token, {eventId, status}) =>
  send({
    token,
    queryParams: 'fake=event',
    body: `
  mutation {
    patchEvent(
        ${objToString({eventId, status})}
    ) {
        event{eventId, status}
    }
  }`,
  });
// fetchServiceCompanyAppeal('', { eventId: 84 }); // не работает
// export const fetchEventStatuses = fetchDict('eventStatuses');

export const fetchAppealTypes = fetchDict('appealTypes', ['section', 'icon']);
export const fetchArrivalTypes = fetchDict('arrivalTypes');
export const fetchBillStatuses = fetchDict('billStatuses');
export const fetchDeliveryTypes = fetchDict('deliveryTypes');
export const fetchEventRelevanceTypes = fetchDict('eventRelevanceTypes');
export const fetchEventTypes = fetchDict('eventType');
export const fetchNotificationTypes = fetchDict('notificationTypes');
export const fetchParkingPlaceTypes = fetchDict('parkingPlaceTypes');
export const fetchNotificationStatuses = fetchDict('notificationStatuses', [
  'id',
]);
// fetchEventStatuses();
// fetchNotificationTypes();
