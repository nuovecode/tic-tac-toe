import {Request, Response} from "express";
import {MysqlError} from "mysql";

export class routingService {

    public config(req: Request, res: Response) {
        res.render('config.ejs')
    }

    public game(req: Request, res: Response) {
        req.app.get('connection').query('SELECT * FROM Game WHERE slug = ?', [req.params.slug] , (error: MysqlError, results:any) => {

            if (error) return res.render('config.ejs',{'error': error})
            if (!results || results.length <= 0) return res.render('config.ejs',{'error': 'This game doesn\'t exist'})
            //@todo: manage errors

            let row:any = Object.values(results)[0]
            req.app.get('connection').query('SELECT * FROM Grid WHERE slug = ?', [req.params.slug] , (error: MysqlError, resultsGrid:any) => {
                // @ts-ignore
                const boxes = resultsGrid.map(res => ({box: res.box, player: res.player}));
                /**
                 * Data passed to the template:
                 */
                res.render('game.ejs', {
                    turn: row.turn, // Define current turn
                    grid: row.grid, // Builds the grid
                    slug: req.params.slug, // Define current game
                    boxes: boxes // Occupied boxes
                })
            })

        });

    }
}
