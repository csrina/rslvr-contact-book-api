var {getContacts} = require('./contacts')

module.exports = [
    { method: 'GET', path: '/', handler: () => {return 'VM\'s resolver contact book project api';} },
    { method: 'GET', path: '/_api/v1.0/contacts', handler: async (request, h) => {return await getContacts()}} 
];