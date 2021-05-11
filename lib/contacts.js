const client = require('./db');

module.exports.getContacts = async (req, res) => {
    try {
        var params = req.query;
        var query = 'select id, first_name, last_name, email from contact';
        var searchLetter = params.letter && /^[a-zA-Z]/.test(params.letter)
        var searchGroup = params.group && /^\d+/.test(params.group);
        
        if (searchLetter || searchGroup) {
            query += ' where '
        }
        if(searchLetter){
            query += `(first_name ilike '${params.letter[0]}%')`
        } 
        if(searchLetter && searchGroup) {
            query += ' AND '
        } 
        if (searchGroup) {
            query += `(id in (select contact_id from contact_association_membership where association_id = ${params.group}))`
        }
        var l = await client.query(query);
        return {
            count: l.rowCount,
            data: l.rows
        };
    } catch (err) {
        console.log(err);
        return res.response({
            status: 500,
            message: `An error occured while getting contacts`
        }).code(500);
    }
}
