const mongoose = require('mongoose');


const connectToDatabase = async()=>{
    const mongo_Uri = process.env.MONGO_URI
    try {
        const connection = await mongoose.connect(mongo_Uri,{
            useNewUrlParser: true,
            useUnifiedTopology: true,
            
        })
    
        console.log("Mongodb connected successfully")

    } catch (error) {
        console.log("error connecting to database "+error)
        process.exit()
    }
}


module.exports = connectToDatabase;