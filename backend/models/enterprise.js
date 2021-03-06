const mongoose =  require('mongoose');
 
const enterpriseSchema = mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    companyName: String,
    username: String,
    password: String,
    dateOfCreation: Date,
    availablePostman: Number,
    address: String,
    email: String
});

module.exports = mongoose.model("Enterprise", enterpriseSchema);