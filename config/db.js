import mongoose from "mongoose"

const connectDb = async() =>{
    try {
        const con = await mongoose.connect('mongodb://0.0.0.0:27017/authentication')
        console.log('database connected..');
    } catch (error) {
        console.log(error);
        process.exit(1)
    }
   
}

export default connectDb