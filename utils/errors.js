const BAD_REQUEST = 400;

if(err.name === 'InvalidData') return res.status(BAD_REQUEST).send({ message: "Data is invalid" });

const NOT_FOUND = 404;

if (err.name === 'NotFound') return res.status(NOT_FOUND).send({message: 'Item not found'});

const SERVER_ERROR = 500;

if (err.name === 'ServerError') return res.status(SERVER_ERROR).send({message: "Server not found"});