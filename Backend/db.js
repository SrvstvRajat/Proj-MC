const mongoose=require('mongoose');

exports.connectDB=()=>
{
mongoose.connect(process.env.DB_LINK).then(()=>{
    console.log('db connencted')
})
}