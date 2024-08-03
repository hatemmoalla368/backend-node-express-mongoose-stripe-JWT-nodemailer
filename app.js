const express= require('express');
const mongoose =require("mongoose")
const dotenv =require('dotenv')
const categorieRouter = require('./routes/categorie.route')
const scategorieRouter = require('./routes/scategorie.route')
const articleRouter = require('./routes/article.route')
const paymentRouter = require( "./routes/payment.route")
const userRouter =require("./routes/user.route")
const orderrouter = require('./routes/orders.route')
dotenv.config()
const app = express();
app.use(express.json())
const cors=require('cors')
app.use(cors({
    origin: 'http://localhost:3000', // Your React app URL
    credentials: true // Allow credentials (cookies, authorization headers, etc.)
  }));
/*app.use(cors({
    origin: 'https://frontend-react-crud-hooks-filepond-cloudinary-usemem-cvtdsmo1s.vercel.app' // Replace with your frontend URL
}));*/
/*app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "https://frontend-react-crud-hooks-filepond-cloudinary-usemem-cvtdsmo1s.vercel.app");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});*/


mongoose.set('strictQuery', true)
mongoose.connect(process.env.DATABASECLOUD,{
    useNewUrlParser: true,
    useUnifiedTopology: true
    })
    .then(() => {console.log("Connexion à la base de données réussie");
    }).catch(err => {
    console.log('Impossible de se connecter à la base de données', err);
    process.exit();
    });
    mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
    });
    app.get("/",(req,res)=>{
    res.send("bonjour");
    });
    app.use("/api/categories", categorieRouter)
    app.use("/api/scategories", scategorieRouter)
    app.use("/api/articles", articleRouter)
    app.use('/api/payment', paymentRouter);
    app.use('/api/user', userRouter);
    app.use('/api/orders', orderrouter);

    app.listen(process.env.PORT, () => {
        
    console.log(`Server is listening on port ${process.env.PORT}`); });
    module.exports = app;
