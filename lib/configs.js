const chalk = require('chalk');
var toml = require('toml');
var concat = require('concat-stream');
var fs = require('fs');
var utils = require('./utils.js');

module.exports = {
    course_file: 'course.toml',
    course_template: 'course_template.toml',
    parsed: {},
    read_config_file: read_config_file
}

function read_config_file(callback) {
    if (!utils.check_file_existence(this.course_file)) {
        return callback(new Error('The file is not present'));
    }
    fs.createReadStream(this.course_file, 'utf8').pipe(concat(function(data) {
        try {
            module.exports.parsed = toml.parse(data);
        } catch (e) {
            console.error("Error parsing the " + this.course_file + " file");
            console.error("Parsing error on line " + e.line + ", column " + e.column +
                ": " + e.message);
            return callback(e);
        }
        set_defaults();
        return callback(null);
    }));
}

function set_defaults() {
    var defaults = {
        exercise_dir: "exercises",
        exercise_prefix: "exercise",
        exercise_template: "exercise_template.toml",
        exercise_schema: "exercise_schema.json"
    }
    for (const [key, value] of Object.entries(defaults)) {
        if (isNaN(module.exports.parsed[key])) {
            module.exports.parsed[key] = value;
        }
    }
}
