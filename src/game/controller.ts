import { Application } from 'express';
import { gameService } from './service';

export class gameController {

    private gameService: gameService;

    constructor(private app: Application) {

        this.gameService = new gameService();

        this.routes();
    }

    public routes() {

        this.app.route(`/V1/game`).get(this.gameService.getGames);

        // this.app.route(`/V1/game:slug`).get(this.gameService.getGame);

        this.app.route(`/V1/game`).post(this.gameService.newGame);

        this.app.route(`/V1/move`).post(this.gameService.makeMove);

    }
}
