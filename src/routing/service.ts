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
            //@todo: manage errors in frontend

            let row:any = Object.values(results)[0]
            res.render('game.ejs', {
                turn: row.turn,
                grid: row.grid,
                slug: req.params.slug
            })
        });

    }
}
