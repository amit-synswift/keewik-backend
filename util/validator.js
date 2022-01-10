const _ = require('lodash')
const data_types = require('../constants/data_types');
const SqlString = require('sqlstring');

const defined_standard = {
    firstname: {
        "type": data_types.string,
        "default": null
    },
    lastname: {
        "type": data_types.string,
        "default": null
    },
    gender: {
        "type": data_types.string,
        "default": null
    },
    email: {
        "type": data_types.string,
        "default": null
    },
    username: {
        "type": data_types.string,
        "default": null
    },
    password: {
        "type": data_types.string,
        "default": null
    },
    id: {
        "type": data_types.integer,
        "default": null
    },
    guid: {
        "type": data_types.string,
        "default": null
    },
    accesstoken: {
        "type": data_types.string,
        "default": "-3"
    },
    dob: {
        "type": data_types.date,
        "default": null
    },
}

exports.validateRequiredParameters = function (request, input_params) {

    input_params = input_params || [];
    var params = requestToParams(request);

    return new Promise(function (resolve, reject) {

        var sp_argument_array = [];
        _.forEach(input_params, function (element) {
            console.log("pasring : ",element);
            var type = defined_standard[element]["type"];

            var value = params[element];

            switch (type) {

                case data_types.integer:
                    if (value === undefined) {

                        sp_argument_array.push(defined_standard[element]["default"]);
                    } else {
                        sp_argument_array.push(params[element]);
                    }
                    break;
                case data_types.string:
                    if (value === undefined) {
                        sp_argument_array.push(defined_standard[element]["default"]);
                    } else if(defined_standard[element].escapeRequired){
                        let result = SqlString.escape(params[element]);
                        console.log('Result',result);
                        sp_argument_array.push(SqlString.escape(params[element]));
                    }else{
                        sp_argument_array.push('"' + params[element] + '"');
                    }
                    break;
                default:
                    if (value === undefined) {
                        sp_argument_array.push(defined_standard[element]["default"]);
                    } else {
                        sp_argument_array.push('"' + params[element] + '"');
                    }
                    break;

            }
        });

        if (sp_argument_array) {
            return resolve(_.toString(sp_argument_array))
            // resolve(sp_argument_array.toString())
            //callback();
        } else {
            reject()
            //callback('Error Occured');
        }
    });
};


function requestToParams(request) {
    return _.mergeWith({}, request.query, request.headers, request.params, request.body);
}
