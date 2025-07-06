let notifyError = null;

export const registerErrorNotifier = (fn) => {
  console.log('✅ Error notifier registered!');
  notifyError = fn;
};

export const notifyErrorMessage = (message) => {
  console.log('📣 notifyErrorMessage called with:', message);
  if (notifyError) {
    notifyError(message);
  } else {
    console.warn('notifyError が登録されていません:', message);
  }
};