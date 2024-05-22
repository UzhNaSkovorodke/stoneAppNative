import { createAsyncActionCreator } from '../utils'
import { createAction } from '@reduxjs/toolkit'

// const receivedNotificationsCount = createAction('notifications/receivedCount');
const getNewNotifications = createAction('notifications/getNewNotifications')
const receivedNotificationsCount = (data) => (dispatch, getState, api) => {
    const { amountOfUnreadNotifications } = data
    const { notifications, auth } = getState()

    if (auth.signin && amountOfUnreadNotifications > notifications.list.length) {
        return api
            .fetchNotifications('', {
                page: 0,
                size: amountOfUnreadNotifications - notifications.list.length,
            })
            .then((res) => dispatch(getNewNotifications(res)))
    }

    return Promise.resolve()
}

const setNotification = createAction('notifications/setNotification')
const setNotificationVisited = createAction('notifications/setNotificationVisited')

const incrimentNotification = createAction('notifications/incrimentNotification')

const error = createAction('message/error')
const removeError = createAction('message/removeError')
const success = createAction('message/success')
const removeSuccess = createAction('message/removeSuccess')
const warning = createAction('message/warning')
const removeWarning = createAction('message/removeWarning')

const toggleProfilePush = createAction('profile/togglePush')

const editProfile = createAsyncActionCreator('Profile', 'edit')
const editProfilePushNotifcations = createAsyncActionCreator('ProfilePushNotifcations', 'edit')
const fetchProfile = createAsyncActionCreator('Profile')

const fetchProjects = createAsyncActionCreator('Projects')
const fetchDocs = createAsyncActionCreator('Docs')
const fetchRoom = createAsyncActionCreator('Room')
const fetchRoomsForProject = createAsyncActionCreator('RoomsForProject')
const fetchAllRooms = createAsyncActionCreator('AllRooms')
const fetchNews = createAsyncActionCreator('News')
const fetchAllNews = createAsyncActionCreator('AllNews')
const fetchServices = createAsyncActionCreator('Services')
const fetchBill = createAsyncActionCreator('Bill')
const fetchBills = createAsyncActionCreator('Bills')
const fetchUtilityBills = createAsyncActionCreator('UtilityBills')
const saveAppealFilters = createAction('appeals/saveFilters')
const fetchAppealList = createAsyncActionCreator('AppealList', 'fetch', {
    pre: ({ data }, dispatch) => {
        dispatch(saveAppealFilters(data))
    },
})

const editAppealRelevance = createAsyncActionCreator('AppealRelevance', 'edit')

const fetchEventTypes = createAsyncActionCreator('EventTypes')
const fetchEventStatuses = createAsyncActionCreator('EventStatuses')
const fetchParkingPlaceTypes = createAsyncActionCreator('ParkingPlaceTypes')
const fetchEventRelevanceTypes = createAsyncActionCreator('EventRelevanceTypes')
const fetchDeliveryTypes = createAsyncActionCreator('DeliveryTypes')
const fetchAppealTypes = createAsyncActionCreator('AppealTypes')
const fetchArrivalTypes = createAsyncActionCreator('ArrivalTypes')
const fetchBillStatuses = createAsyncActionCreator('BillStatuses')
const fetchBillPaymentLink = createAsyncActionCreator('BillPaymentLink')
const fetchFundsFlow = createAsyncActionCreator('FundsFlow')
const fetchFundsFlowTypes = createAsyncActionCreator('FundsFlowTypes')
const fetchRoomPaymentLink = createAsyncActionCreator('RoomPaymentLink')
const fetchConfig = createAsyncActionCreator('Config')
const updateNotification = createAsyncActionCreator('Notification', 'update', {
    pre: ({ data }, dispatch) => {
        dispatch(setNotificationVisited(data.notificationId))
    },
})
const fetchNotifications = createAsyncActionCreator('Notifications')
const fetchNotificationTypes = createAsyncActionCreator('NotificationTypes')
const fetchNotificationStatuses = createAsyncActionCreator('NotificationStatuses')

const resetPassword = createAsyncActionCreator('Password', 'reset')
const changePassword = createAsyncActionCreator('Password', 'change', {
    post: ({ response }, dispatch) => {
        if (response.data.updatePasswordProfile) {
            dispatch(
                success([
                    {
                        message: 'Ваш пароль успешно изменен.',
                    },
                ])
            )
            // eslint-disable-next-line no-use-before-define
            dispatch(logout())
        } else {
            // eslint-disable-next-line no-throw-literal
            throw [
                {
                    message:
                        'Не удалось изменить пароль. Пожалуйста, проверьте соответствует ли Ваш пароль требованиям.',
                },
            ]
        }
    },
    catch: (o, dispatch) => {
        dispatch(
            error([
                {
                    message:
                        'Не удалось изменить пароль. Пожалуйста, проверьте соответствует ли Ваш пароль требованиям.',
                },
            ])
        )
    },
})
const editProfileRequest = createAsyncActionCreator('ProfileRequest', 'edit')

const sendPass = createAsyncActionCreator('Pass', 'send', {
    post: ({ data }, dispatch, getState) => {
        const { appeals } = getState()
        const { filter, pagination } = appeals
        if (filter && Number(data.eventTypeId) === Number(filter.eventTypeId)) {
            dispatch(
                fetchAppealList({
                    ...filter,
                    ...pagination,
                })
            )
        }
    },
})

const addComment = createAction('comment/add')
const setComment = createAction('comment/set')
const sendComment = createAsyncActionCreator('Comment', 'send', {
    // pre: ({ data }, dispatch, getState) => {
    //     const { profile } = getState();
    //     const { avatar, fio } = profile;
    //     const { text, files } = data;
    //     const [userSurname, userName, userPatronymic] = (fio || '').split(' ');

    //     dispatch(addComment({
    //         avatar,
    //         userSurname,
    //         userName,
    //         userPatronymic,
    //         createdAt: new Date().toISOString(),
    //         text,
    //         file: files
    //     }));
    // },
    post: ({ response }, dispatch) => {
        dispatch(setComment(response.data.postComment))
    },
})

const authProcess = createAction('auth/process')
const authSuccess = createAction('auth/success')

const checkAuth = createAsyncActionCreator('Auth', 'check')
const clearEventTypes = createAction('eventTypes/clear')

const logout = createAsyncActionCreator('logout', '', {
    pre: (o, dispatch) => {
        dispatch(clearEventTypes())
    },
})

const clearAppeal = createAction('appeal/clear')

const fetchGuestPass = createAsyncActionCreator('GuestPass', 'fetch', {
    pre: (o, dispatch) => {
        dispatch(clearAppeal())
    },
})
const fetchDeliveryPass = createAsyncActionCreator('DeliveryPass', 'fetch', {
    pre: (o, dispatch) => {
        dispatch(clearAppeal())
    },
})
const fetchTaxiPass = createAsyncActionCreator('DeliveryPass', 'fetch', {
    pre: (o, dispatch) => {
        dispatch(clearAppeal())
    },
})

const fetchServiceCompanyAppeal = createAsyncActionCreator('ServiceCompanyAppeal', 'fetch', {
    pre: (o, dispatch) => {
        dispatch(clearAppeal())
    },
})

const fetchEditProfileAppeal = createAsyncActionCreator('EditProfileAppeal', 'fetch', {
    pre: (o, dispatch) => {
        dispatch(clearAppeal())
    },
})

const auth =
    ({ login, password }) =>
    (dispatch, getState, api) => {
        dispatch(authProcess())

        return api
            .auth(null, {
                login,
                password,
            })
            .then((res) => {
                dispatch(authSuccess(res))
                dispatch(fetchProfile(res.token))
            })
    }
// eslint-disable-next-line max-len
const authenticate = () => (dispatch) =>
    dispatch(checkAuth()).then((res) => dispatch(fetchProfile(res.token)))

export default {
    incrimentNotification,
    getNewNotifications,
    receivedNotificationsCount,
    setNotification,
    setNotificationVisited,
    updateNotification,

    error,
    removeError,
    success,
    removeSuccess,
    warning,
    removeWarning,

    authProcess,
    authSuccess,
    auth,
    checkAuth,
    authenticate,
    clearEventTypes,
    logout,

    toggleProfilePush,
    editProfilePushNotifcations,
    editProfile,
    editProfileRequest,
    fetchProfile,
    fetchFundsFlow,
    fetchFundsFlowTypes,
    fetchProjects,
    fetchDocs,
    fetchRoom,
    fetchRoomsForProject,
    fetchAllRooms,
    fetchNews,
    fetchAllNews,
    fetchServices,
    fetchBill,
    fetchBills,
    fetchAppealList,
    fetchEventTypes,
    fetchEventStatuses,
    fetchParkingPlaceTypes,
    fetchEventRelevanceTypes,
    fetchDeliveryTypes,
    fetchAppealTypes,
    editAppealRelevance,
    fetchArrivalTypes,
    fetchBillStatuses,
    fetchBillPaymentLink,
    fetchRoomPaymentLink,
    fetchConfig,
    fetchNotifications,
    fetchNotificationTypes,
    fetchNotificationStatuses,

    clearAppeal,
    fetchGuestPass,
    fetchDeliveryPass,
    fetchTaxiPass,
    fetchServiceCompanyAppeal,
    fetchEditProfileAppeal,

    resetPassword,
    changePassword,

    sendPass,
    addComment,
    setComment,
    sendComment,
    saveAppealFilters,
    fetchUtilityBills,
}
