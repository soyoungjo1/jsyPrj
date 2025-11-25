import { defineStore } from 'pinia';

//모달창
export const useRootStore = defineStore('root', {
    state : () => ({
        toastShow: false,
        toastText: '',
        confirm: false,
        confirmTitle: '',
        confirmMessage: '',
        confirmCancelBtn: '',
        confirmOkayBtn: '',
        confirmCancelFunc: null as (() => void) | null,
        confirmOkayFunc: null as (() => void) | null,
        confirmIsShowClose: false,
        confirmButtonDisabled: false,
        messageDialogShow: false,
        messageDialogTitle: '',
        messageDialogMessage: '',
        messageDialogButtonText: '',
        messageDialogClickListener: null as (() => void) | null,
    }),
    getters: {

    },  
    actions: {
        //토스트창
        toast(msg: string) {
            this.toastShow = true;
            this.toastText = msg;

            setTimeout(() => {
                this.toastShow = false;
            }, 2000);
        },
        //확인창
        openConfirm(title: string, message: string, cancelBtn: string, okayBtn: string, cancelFunc: (() => void) | null, okayFunc?: () => void, isShowClose?: boolean, buttonDisabled?: boolean) {
            console.log('openConfirm:::::', title);
            this.confirmTitle = title;
            this.confirmMessage = message;
            this.confirmCancelBtn = cancelBtn;
            this.confirmOkayBtn = okayBtn;
            this.confirmCancelFunc = cancelFunc;
            this.confirmOkayFunc = okayFunc ?? null ;
            this.confirm = true;
            this.confirmIsShowClose = isShowClose ?? false;
            this.confirmButtonDisabled = buttonDisabled ?? false;
        },
        //확인창 끄기
        resetConfirm() {
            this.confirmTitle = '';
            this.confirmMessage = '';
            this.confirmCancelBtn = '';
            this.confirmOkayBtn = '';
            this.confirmCancelFunc = null;
            this.confirmOkayFunc = null;
            this.confirm = false;
            this.confirmIsShowClose = false;
            this.confirmButtonDisabled = false;
        },
        //메세지창
        showMessageDialog(title : string, message: string, buttonText: string, buttonClick?: () => void){
            this.messageDialogTitle = title;
            this.messageDialogMessage = message;
            this.messageDialogButtonText = buttonText;
            this.messageDialogClickListener = buttonClick ?? null;
            this.messageDialogShow = true;
        },
        //메세지창 끄기
        resetMessageDialog() {
            this.messageDialogTitle = '';
            this.messageDialogMessage = '';
            this.messageDialogButtonText = '';
            this.messageDialogClickListener = null;
            this.messageDialogShow = false;
        },
    }
})