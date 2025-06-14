const sendSuccessResponse = ({res, statusCode, data, message}) => {
  res.status(statusCode).json({
    status: "success",
    data,
    message,
  });
}

const sendErrorResponse = ({res, statusCode, message}) => {
  res.status(statusCode).json({
    status: "error",
    message,
    message: "Data fetched",
  });
}

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
};