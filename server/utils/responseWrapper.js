export const success = (res, data = {}, message = 'OK', status = 200) => {
  return res.status(status).json({
    success: true,
    data,
    message,
  });
};

export const error = (res, message = 'エラーが発生しました', status = 500) => {
  return res.status(status).json({
    success: false,
    message,
  });
};

export const wrapperAsync = (fn) => {
  return function (fn){
    fn(res,req,next).catch(e => next(e))
  }
};