const handleErrorResponse = (res, e) => {
  const BAD_REQUEST = 400;
  const NOT_FOUND = 404;
  const SERVER_ERROR = 500;

  if (e.name === 'InvalidData') {
    console.error('InvalidData Error:');
    return res.status(BAD_REQUEST).send({ message: 'Data is invalid' });
  }

  if (e.name === 'NotFound') {
    console.error('NotFound Error:');
    return res.status(NOT_FOUND).send({ message: 'Item not found' });
  }

  if (e.name === 'ServerError') {
    console.error('ServerError Error:');
    return res.status(SERVER_ERROR).send({ message: 'Server not found' });
  }

  console.error('Other Error:', e);
  return res.status(SERVER_ERROR).send({ message: 'Internal Server Error' });
};

module.exports = {
  handleErrorResponse,
};
