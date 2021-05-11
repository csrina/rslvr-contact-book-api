const {getContacts} = require('./contacts')
const {postContact, putContact, getContact, deleteContact} = require('./contact')
const {getGroups} = require('./groups')

module.exports = [
    { method: 'GET', path: '/', handler: () => {return 'VM\'s resolver contact book project api';} },
    { method: 'GET', path: '/_api/v1.0/contacts', handler: async (req, res) => {return await getContacts(req, res)}},
    { method: 'POST', path: '/_api/v1.0/contact', handler: async (req, res) => {return await postContact(req, res)}},
    { method: 'PUT', path: '/_api/v1.0/contact/{id}', handler: async (req, res) => {return await putContact(req, res)}},
    { method: 'GET', path: '/_api/v1.0/contact/{id}', handler: async (req, res) => {return await getContact(req, res)}},
    { method: 'DELETE', path: '/_api/v1.0/contact/{id}', handler: async (req, res) => {return await deleteContact(req, res)}},
    { method: 'GET', path: '/_api/v1.0/groups', handler: async (req, res) => {return await getGroups(req, res)}}
];