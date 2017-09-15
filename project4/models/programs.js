var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProgramSchema = new Schema({
	    inst1: String,
	    inst2: String,
	    inst3: String,
 	    inst4: String,
        inst5: String,
        inst6: String,
        title: {type: String, default: "THIS IS DEFAULT"},
		timeStamp: [String],
		comment: String 
    })

module.exports = mongoose.model('Program', ProgramSchema)