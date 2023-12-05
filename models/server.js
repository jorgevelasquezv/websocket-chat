const express = require('express');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { dbConnection } = require('../database/config.db');
const { createServer } = require('http');
const { socketController } = require('../sockets/socket.controllers');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.server = createServer(this.app);
        this.io = require('socket.io')(this.server);

        this.paths = {
            auth: '/api/auth',
            categories: '/api/categories',
            products: '/api/products',
            search: '/api/search',
            uploads: '/api/uploads',
            users: '/api/users',
        };

        // Conectar a base de datos
        this.connectDB();

        //Middlewares
        this.middleware();

        //Rutas de mi aplicación
        this.routes();

        // Sockets
        this.sockets();
    }

    async connectDB() {
        await dbConnection();
    }

    middleware() {
        // Cors
        this.app.use(cors());

        // Lectura y parseo del body
        this.app.use(express.json());

        // Directorio Publico
        this.app.use(express.static('public'));

        // Carga de archivos
        this.app.use(fileUpload({
            useTempFiles: true,
            tempFileDir: '/tmp/',
            createParentPath: true,
        }));
    }

    routes() {
        this.app.use(this.paths.auth, require('../routes/auth.routes'));
        this.app.use(
            this.paths.categories,
            require('../routes/categories.routes')
        );
        this.app.use(this.paths.products, require('../routes/products.routes'));
        this.app.use(this.paths.search, require('../routes/search.routes'));
        this.app.use(this.paths.uploads, require('../routes/uploads.routes'));
        this.app.use(this.paths.users, require('../routes/user.routes'));
    }

    sockets() {
        this.io.on('connection', (socket) => socketController(socket, this.io));
    }

    listen() {
        this.server.listen(this.port, () => {
            console.log(`Servidor escuchando en el puerto ${this.port}`);
        });
    }
}

module.exports = Server;
