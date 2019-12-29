import express, { Application } from 'express';
import bodyParser from 'body-parser';
import mysql, {MysqlError} from 'mysql'
import cors from 'cors'
import { routingController } from './routing/controller';
import { gameController } from './game/controller';
const path = require('path');

class App {

    public app: Application;

    public Base: routingController;

    public Game: gameController;

    constructor() {

        this.app = express();

        this.setConfig();

        this.connectDb();

        this.Base = new routingController(this.app);

        this.Game = new gameController(this.app);

    }

    private setConfig() {

        this.app.set('views', __dirname + '/templates');

        this.app.use(express.static(path.join(__dirname, 'static')))

        this.app.set('view engine', 'ejs');

        this.app.use(bodyParser.json({ limit: '50mb' }));

        this.app.use(bodyParser.urlencoded({ limit: '50mb', extended:true}));

        this.app.use(cors());
    }

    private connectDb() {

        const host = process.env.DB_HOST || 'mysql';

        const user = process.env.DB_USER || 'root';

        const password = process.env.DB_PASSWORD || 'password';

        const database = process.env.DB_NAME || 'tictocDb';

        const connection = mysql.createConnection({
            host, user, password, database
        });

        connection.connect(( error: MysqlError) => {
            if (error) throw error;
        });

        this.app.set('connection', connection);

    }

}

export default new App().app;
