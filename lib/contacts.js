var client = require('./db');

async function getContacts() {
    try {
        var l = await client.query('select id, first_name || \' \' || last_name as name, email from contact');
        return {
            count: l.rowCount,
            data: l.rows
        };
    } catch (err) {
        console.log(err)
    }
}

module.exports.getContacts = getContacts;