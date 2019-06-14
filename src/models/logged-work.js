const mongoose = require('mongoose');
const Logged = new mongoose.Schema({
    user: { type: String  , required:true},    
    typeOfWork: {type: String} ,
    project: { type: String, required:true}, 
    startTime: {type: Date , default:Date.now},
    endTime: {type: Date }, 
    details: {type: String},
    hours: {type: Number}
}) 
 

//export default mongoose.model('user', User)
module.exports = mongoose.model('loggedWork', Logged)