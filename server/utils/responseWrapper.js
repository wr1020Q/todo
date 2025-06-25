exports.success = (res, data = {}, message = 'OK', status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
};

exports.error = (res, message = 'エラーが発生しました', status = 500) => {
  return res.status(status).json({
    success: false,
    message,
  });
};