const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    description : String,
    coach : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String },
    patient : { id: {type : mongoose.Schema.Types.ObjectId, ref :'User'}, firstName: String, lastName: String }
});
const Feedback = mongoose.model('Feedback',feedbackSchema);
module.exports = Feedback