require("dotenv").config();
const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const port = process.env.port || 5000;
const expressHbs = require('express-handlebars');
const { createPagination } = require('express-handlebars-paginate');

// Sử dụng middleware body-parser để phân tích các yêu cầu có nội dung dưới dạng JSON
app.use(bodyParser.json());

// Đảm bảo rằng bodyParser.urlencoded() được sử dụng nếu bạn cần phân tích dữ liệu từ form POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Serve static files from the /client/assets directory
app.use(express.static(path.join(__dirname, '../client/assets')));

app.engine(
    'hbs',
    expressHbs.engine({
        extname: 'hbs',
        defaultLayout: 'layout',
        layoutsDir: path.join(__dirname, '../client/views/layouts/'),
        partialsDir: path.join(__dirname, '../client/views/partials/'),
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
        },
        helpers: {
            createPagination: createPagination,
        },
    })
);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../client/views'));

// trang chu
app.get("/", (req, res) => {
    res.render("index", { layout: false }); // Chỉ định không sử dụng layout
});
app.use("/", require('./routes/authRoute'));

// login register ...
app.use("/account", require('./routes/accountRoute'));


// homeView when user login success
app.use('/home', require('./routes/homeRoute'));


// user 
app.use("/users", require('./routes/userRoute'));


app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).render('error', { message: 'Server error!' });
});



app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});
