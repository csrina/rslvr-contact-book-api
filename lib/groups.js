const client = require('./db');


module.exports.getGroups = async (req, res) => {
    try {
        var query = `select * from association`;
        var queryResult = await client.query(query);
        return {
           data: queryResult.rows
        };
    } catch (err) {
        console.log(err);
        return res.response({
            status: 500,
            message: `An error occured while getting contact`
        }).code(500);
    }
}