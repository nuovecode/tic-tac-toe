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
            if (error) return res.send({status: 'ko', error: error});
            res.json(results);
        });
    }

    public makeMove(req: Request, res: Response, next: any) {
        req.app.get('connection').query(`SELECT * FROM ${GRID_TABLE} WHERE slug="${req.body.slug}" AND box=${req.body.box}`,(error: MysqlError, results:any) => {
            if (error) return res.send({status: 'ko', error: error});
            if (!results || results.length <= 0) {
                req.app.get('connection').query(`INSERT INTO ${GRID_TABLE} SET ?`, req.body, (error: MysqlError) => {
                    if (error) return res.send({status: 'ko', error: error});
                    next();
                });
            } else {
                return res.send({status: 'ko', error: 'Not empty'});
            }

        });
    }

    public winnerCheck(req: Request, res: Response, next: any) {
        req.app.get('connection').query(`SELECT box FROM ${GRID_TABLE} WHERE slug="${req.body.slug}" AND player=${req.body.player}`,(error: MysqlError, results:any) => {
            if (error) return res.send({status: 'ko', error: error});
            // @ts-ignore
            const playerBoxes = results.map(res => res.box)
            if (playerBoxes.length < 3) return next () // No winner. the game continues (updateGame)
            console.log(playerBoxes)
            /**
             * Player wins if 'playerBoxes' array contains:
             * - 3 consecutive numbers
             * - 3 consecutive numbers divisible by 9
             * - 3 consecutive numbers divisible by 11
             * In a grid by 10 make a check on the first of the two numbers
             * to avoid false winnings on the borders of the grid
             */
            res.json({ status: 'ok', winner: req.body.player, turn: null }); // Player wins the game TODO: Clear from tables
        });

    }
    public updateGame(req: Request, res: Response) {
        const turn = req.body.player + 1
        req.app.get('connection').query(`UPDATE ${GAME_TABLE} SET turn=${turn} WHERE slug="${req.body.slug}"`, (error: MysqlError) => {
            if (error) return res.send({status: 'ko', error: error});
            res.json({ status: 'ok', winner: null, turn: turn });
        });
    }

    public resetGame(req: Request, res: Response) {
        // TODO: Clear occourrency of current game in Game and Board table
    }



}
