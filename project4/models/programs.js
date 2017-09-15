var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var ProgramSchema = new Schema({
		title: String,
		comment: String,
		timeStamp: String,
	    inst1: [Number],
	    inst2: [Number],
	    inst3: [Number],
 	    inst4: [Number],
        inst5: [Number],
        inst6: [Number]   
    })

module.exports = mongoose.model('Program', ProgramSchema)