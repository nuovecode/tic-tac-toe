import { Request, Response } from "express";
import { MysqlError } from 'mysql'

const GAME_TABLE = 'Game' //@todo move outside
const GRID_TABLE = 'Grid' //@todo move outside

export class gameService {

    public newGame(req: Request, res: Response) {
        const post = {
            slug: Math.random().toString(36).slice(2), //@todo Totally radom for now. Make it unique
            players: req.body.players,
            grid: req.body.grid,
            turn: 1
        }
        req.app.get('connection').query(`INSERT INTO ${GAME_TABLE} SET ?`, post, (error: MysqlError) => {
            if (error) return res.send({status: 'ko', error: error});
            res.json(post);
        });
    }

    public getGames(req: Request, res: Response) {
        req.app.get('connection').query(`SELECT * FROM ${GAME_TABLE}`, (error: MysqlError, results:any) => {
            if (error) return res.send(error);
            res.json(results);
        });
    }

    public makeMove(req: Request, res: Response, next: any) {
        req.app.get('connection').query(`SELECT * FROM ${GRID_TABLE} WHERE slug="${req.body.slug}" AND box=${req.body.box}`,(error: MysqlError, results:any) => {
            if (error) return res.send(error);
            if (!results || results.length <= 0) {
                req.app.get('connection').query(`INSERT INTO ${GRID_TABLE} SET ?`, req.body, (error: MysqlError) => {
                    if (error) return res.send({status: 'ko', error: error});
                    res.json(req.body);
                });
            } else {
                return res.send({status: 'ko', error: 'Not empty'});
            }

        });
    }

    public resetGame(req: Request, res: Response) {
        // TODO: Clear occourrency of current game in Game and Board table
    }



}
