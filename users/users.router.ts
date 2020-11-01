import { Router } from '../common/router';
import * as restify from 'restify';
import { User } from './users.model';
import { NotFoundError } from 'restify-errors';

class UsersRouter extends Router {
    constructor() {
        super();
        this.on('beforeRender', (document) => {
            document.password = undefined;
        });
    }
    applyRoutes(application: restify.Server) {
        /**
         * All users are listed through this route
         */
        application.get('/users', (req, res, next) => {
            User.find().then(this.render(res, next)).catch(next);
        });

        /**
         * An specific user is obtained from the database
         */
        application.get('/users/:id', (req, res, next) => {
            User.findById(req.params.id)
                .then(this.render(res, next))
                .catch(next);
        });

        /**
         * Creating an user
         */
        application.post('/users', (req, res, next) => {
            let user = new User(req.body);
            user.save().then(this.render(res, next)).catch(next);
        });

        /**
         * Update an user overwriting the user completely
         */
        application.put('/users/:id', (req, res, next) => {
            const options = { overwrite: true };

            User.update({ _id: req.params.id }, req.body, options)
                .exec()
                .then((result): any => {
                    if (result.n) {
                        return User.findById(req.params.id);
                    } else {
                        throw new NotFoundError('Documento não encontrado');
                    }
                })
                .then(this.render(res, next))
                .catch(next);
        });

        /**
         * PATCH - diferente da rota put, a alteração é parcial
         * depende muito de quais campos foram enviados e quais valores
         * É necessario tratar o header
         */
        application.patch('/users/:id', (req, res, next) => {
            const options = { new: true };
            User.findByIdAndUpdate(req.params.id, req.body, options)
                .then(this.render(res, next))
                .catch(next);
        });

        /**
         * Rota de delete. Extremamente simples. Apagar o recurso informado na url
         */
        application.del('/users/:id', (req, res, next) => {
            // Assemelha-se ao metodo update.
            User.remove({ _id: req.params.id })
                .exec()
                .then((cmdResult: any) => {
                    if (cmdResult.result.n) {
                        res.send(204);
                    } else {
                        throw new NotFoundError('Documento não encontrado');
                    }
                    return next();
                })
                .catch(next);
        });
    }
}

export const usersRouter = new UsersRouter();
