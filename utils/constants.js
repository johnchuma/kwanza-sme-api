const internalError = (error) => {
  res.status(500).json({
    status: false,
    message: "Internal server error",
    error: error,
  });
};
const monthsNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const successResponse = (data) => {
  res.status(200).json({
    status: true,
    data: data,
  });
};
module.exports = {
  internalError,
  monthsNames,
  successResponse,
};
