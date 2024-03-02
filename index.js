const express = require('express');
const dotenv = require('dotenv');
const methodOverride = require('method-override');
const bodyParser = require('body-parser');
const routesClient = require('./routes/client/index.route');
const routesAdmin = require('./routes/admin/index.route');
const database = require('./config/database')
const systemConfig = require('./config/system')
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const path = require('path');
const moment = require('moment');
const http = require('http');
const { Server } = require("socket.io");

dotenv.config();

database.connect();

const app = express();
const port = process.env.PORT;

//SocketIO
const server = http.createServer(app);
const io = new Server(server);

global._io = io;
//End SocketIO

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'));

app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');

app.use(express.static(`${__dirname}/public`));

/* New Route to the TinyMCE Node module */
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

// flash
app.use(cookieParser('KJJSLKASASASA'));
app.use(session({ cookie: { maxAge: 60000 } }));
app.use(flash());
// End flash

//App Local Variables
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;

//Routes Clients
routesClient(app);

//Routes Admin
routesAdmin(app);

// 404 Not Found
app.get("*", (req, res) => {
  res.render("client/pages/errors/404", {
    pageTitle: "404 Not Found",
  });
  // res.redirect("/");
});
server.listen(port, () => {
  console.log(`App is listening on port ${port}`)
});
