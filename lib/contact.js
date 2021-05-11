const client = require('./db');
const Hoek = require('hoek');
const Joi = require('@hapi/joi');

const userSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().allow(''),
    email: Joi.string().email().allow(''),
    phone: Joi.string().regex(/^[\+]?[(]?[0-9]{3}[)]?[\-\s\.]?[0-9]{3}[\-\s\.]?[0-9]{4,6}/).messages({
        'string.pattern.base': 'Phone should be a valid phone number'
    }).allow(''),
    address: Joi.object({
        street: Joi.string().allow(''),
        postal: Joi.string().allow(''),
        city: Joi.string().allow(''),
        province: Joi.string().allow(''),
        country: Joi.string().allow('')
    }),
    groups: Joi.array()
});

module.exports.getContact = async (req, res) => {
    try {
        var id = Hoek.escapeHtml(req.params.id);
        var contactQuery = `select * from contact where id = ${id}`;
        var associationQuery = `select association_id from contact_association_membership where contact_id = ${id};`
        var contactInfo = await client.query(contactQuery);
        if (contactInfo.rowCount === 0 ) {
            return res.response({
                status: 404,
                message: `Could not find contact with id ${id}`
            }).code(404);
        }
        var associationInfo = await client.query(associationQuery);
        var associationIds = associationInfo.rows.map(row => row.association_id);
        var output = contactInfo.rows[0];
        output.groups = associationIds;
        return {output};
    } catch (err) {
        console.log(err);
        return res.response({
            status: 500,
            message: `An error occured while getting contact`
        }).code(500);
    }
};

module.exports.deleteContact = async (req, res) => { 
    try {
        var id = Hoek.escapeHtml(req.params.id);
        var query = `delete from contact where id = ${id}`;
        var queryResult = await client.query(query);
        if(queryResult.rowCount === 0) {
            return res.response({
                status: 404,
                message: `Object with id ${id} does not exist or has already been deleted`
            }).code(404);
        }
        return res.response({
            status: 200,
            message: `Deleted object ${id}`
        }).code(200);
    } catch (err) {
        console.log(err);
        return res.response({
            status: 500,
            message: `An error occured while getting contact`
        }).code(500);
    }
};

updateContactGroupMembership = async (contactId, groupIds) => {
    try {
        var cleanUpQuery = `delete from contact_association_membership where contact_id = ${contactId}`;
        var cleanUpResult = await client.query(cleanUpQuery);
        var contactGroupQuery = 'INSERT INTO "contact_association_membership" ("contact_id", "association_id") VALUES ';
        if (groupIds.length > 0) {
            groupIds.forEach(groupId => {
                contactGroupQuery += `(${contactId}, ${groupId}),`
            });
            contactGroupQuery =  contactGroupQuery.slice(0, -1);
            contactGroupQuery += ' RETURNING id;'
            console.log(contactGroupQuery);
            var contactGroupId = await client.query(contactGroupQuery);
        }
    } catch (err) {
        console.log(err);
    }
}


module.exports.postContact = async (req, res) => { 
    try {
        try {
            Joi.assert(req.payload, userSchema)
        } catch (err) {
            return res.response({
                status: 400,
                message: err.details[0].message
            }).code(400);
        }
        var contactQuery = `INSERT INTO "contact" ("first_name", "last_name", "email", "phone_number", "address") VALUES 
            ('${req.payload.first_name}', '${req.payload.last_name || ''}', '${req.payload.email || ''}', '${req.payload.phone || ''}', '${JSON.stringify(req.payload.address) || JSON.stringify({})}') RETURNING id;`;
        console.log(contactQuery)

        var newContactInfo = await client.query(contactQuery);
        var newContactId = newContactInfo.rows[0].id;
        updateContactGroupMembership(newContactId, req.payload.groups);
        return res.response({
            status: 200,
            message: `Successfully created object with id ${newContactId}`
        }).code(200);
    } catch (err) {
        console.log(err);
        return res.response({
            status: 500,
            message: `An error occured while new object`
        }).code(500);
    }
};
module.exports.putContact = async (req, res) => {
    try {
        try {
            Joi.assert(req.payload, userSchema)
        } catch (err) {
            return res.response({
                status: 400,
                message: err.details[0].message
            }).code(400);
        }
        var id = Hoek.escapeHtml(req.params.id);
        var contactQuery = `UPDATE "contact" SET 
                            "first_name" = '${req.payload.first_name}', 
                            "last_name" = '${req.payload.last_name || ''}', 
                            "email" = '${req.payload.email || ''}', 
                            "phone_number" = '${req.payload.phone || ''}', 
                            "address" = '${JSON.stringify(req.payload.address) || JSON.stringify({})}'
                            WHERE id = ${id}` 
        await client.query(contactQuery);
        updateContactGroupMembership(id, req.payload.groups);
        return res.response({
            status: 200,
            message: `Successfully updatd object with id ${id}`
        }).code(200);
    } catch (err) {
        console.log(err);
        return res.response({
            status: 500,
            message: `An error occured while updating object`
        }).code(500);
    }
};
