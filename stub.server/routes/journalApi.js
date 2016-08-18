var guidService = require('../utility/guidService');
var Enumerable = require('linq');
var journals = require('./../data/data').journals;

function journalApi(app, express) {
    var apiRouter = express.Router();

    apiRouter.route('/journals')
        .get(function (req, res) {
            res.json({data: journals});
        })
        .post(function (req, res) {
            var cmd = req.body;

            console.log(cmd);

            cmd.id = guidService.newGuid();
            journals.push(cmd);

            console.log(cmd);

            res.json({
                validationResult: {isValid: true},
                returnValue: {id: cmd.id}
            });
        });

    apiRouter.route('/journals/:id')
        .get(function (req, res) {
            var id = req.params.id;

            var journal = Enumerable.from(journals)
                .first(function (item) {
                    return item.id == id;
                });

            res.json(journal);
        })
        .put(function (req, res) {
            var id = req.params.id;
            var cmd = req.body;
            console.log(cmd);

            var journal = Enumerable.from(journals)
                .first(function (item) {
                    return item.id = id;
                });

            journal.temporaryNumber = cmd.temporaryNumber;
            journal.temporaryDate = cmd.temporaryDate;
            journal.number = cmd.number;
            journal.date = cmd.date;
            journal.description = cmd.description;

            res.json({
                validationResult: {isValid: true}
            });
        });

    return apiRouter;
}

module.exports = journalApi;
