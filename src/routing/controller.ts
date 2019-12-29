import { Application } from 'express';
import { routingService } from './service';

export class routingController {

    private service: routingService;

    constructor(private app: Application) {

        this.service = new routingService();

        this.routes();
    }

    public routes() {

        this.app.route('/').get(this.service.config);

        this.app.route('/:slug').get(this.service.game);

    }
}
