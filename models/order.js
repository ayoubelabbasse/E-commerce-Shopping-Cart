var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var schema = new Schema({
    user : {type:Schema.Types.ObjectId, ref: 'user'},
    cart: {type: Object, required: true},
    addresse: {type: String, required: true},
    name: {type: String, required: true},
    paymentId: {type: Object, required: true}
})

module.exports = mongoose.model('Order', schema);