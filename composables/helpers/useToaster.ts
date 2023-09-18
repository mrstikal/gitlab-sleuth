import * as pkg from "vue-toastification"

const { TYPE, useToast } = pkg;

type ToastType = 'success' | 'info' | 'error' | 'warning' | 'default';

const useToaster = (message: string, type: ToastType = 'default') => {

  const toast = useToast();

  let toastType;

  switch (type) {
    case 'success':
      toastType = TYPE.SUCCESS;
      break;
    case 'info':
      toastType = TYPE.INFO;
      break;
    case 'error':
      toastType = TYPE.ERROR;
      break;
    case 'warning':
      toastType = TYPE.WARNING;
      break;
    case 'default':
      toastType = TYPE.DEFAULT;
      break;
  }

  toast(message, { type: toastType })
}

export default useToaster;