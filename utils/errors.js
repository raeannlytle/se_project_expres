const BAD_REQUEST = 400;

if(e.name === 'InvalidData') {
  console.error('InvalidData Error:', e);
  return res.status(BAD_REQUEST).send({ message: "Data is invalid" });
}

const NOT_FOUND = 404;

if (e.name === 'NotFound') {
  console.error('NotFound Error:', e);
  return res.status(NOT_FOUND).send({message: 'Item not found'});
}

const SERVER_ERROR = 500;

if (e.name === 'ServerError') {
  console.error('ServerError Error:', e);
  return res.status(SERVER_ERROR).send({message: "Server not found"});
}