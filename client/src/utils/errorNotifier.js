let notifyError = null;

export const registerErrorNotifier = (fn) => {
  notifyError = fn;
};

export const notifyErrorMessage = (message) => {
  if (notifyError) {
    notifyError(message);
  } else {
    console.warn('notifyError が登録されていません:', message);
  }
};