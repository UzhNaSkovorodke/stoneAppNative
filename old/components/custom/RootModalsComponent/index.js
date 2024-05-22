import RootModalsComponent from './RootModalsComponent'
import ModalRootContext from './context'

const onCloseModal = (modalRootContext, modalTimeStamp) => {
    const { modalRootState, setModalsRootArray } = modalRootContext
    setModalsRootArray(modalRootState.filter(({ timeStamp }) => timeStamp !== modalTimeStamp))
}

export const openAgreementModal = (modalRootContext, { message, onAcceptClicked }) => {
    const { setModalsRootArray } = modalRootContext
    const timeStamp = Date.now()

    setModalsRootArray((state) => [
        ...state,
        {
            modalType: 'downloadAgreementModal',
            message,
            onAcceptClicked,
            timeStamp,
            onClose: () => onCloseModal(modalRootContext, timeStamp),
        },
    ])
}

export default { ModalRootContext, RootModalsComponent, openAgreementModal }
