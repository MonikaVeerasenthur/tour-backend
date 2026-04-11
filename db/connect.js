const mongoose = require('mongoose');

db = async () => {
    try{
        mongoose.set('strictQuery', true);
        await mongoose.connect(process.env.ATLAS_URI);
        console.log('Db connection established.✅')
    }catch(error){
        console.log('DB Error ❌: ', error);
    }
}

module.exports = db;