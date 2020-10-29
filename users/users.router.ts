import { Router } from '../common/router';
import * as restify from 'restify';
import { User } from './users.model';

class UsersRouter extends Router {
    applyRoutes(application: restify.Server) {
        /**
         * All users are listed through this route
         */
        application.get('/users', (req, res, next) => {
            User.find().then((users) => {
                res.json(users);
                return next();
            });
        });

        /**
         * An specific user is obtained from the database
         */
        application.get('/users/:id', (req, res, next) => {
            User.findById(req.params.id).then((user) => {
                if (user) {
                    res.json(user);
                    return next();
                }

                res.send(404);
                return next();
            });
        });

        /**
         * Creating an user
         */
        application.post('/users', (req, res, next) => {
            let user = new User(req.body);
            user.save().then((user) => {
                user.password = undefined;
                res.json(user);
                return next();
            });
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
                        res.send(404);
                    }
                })
                .then((user) => {
                    res.json(user);
                    return next();
                });
        });

        /**
         * PATCH - diferente da rota put, a alteração é parcial
         * depende muito de quais campos foram enviados e quais valores
         * É necessario tratar o header
         */
        application.patch('/users/:id', (req, res, next) => {
            const options = { new: true };
            User.findByIdAndUpdate(req.params.id, req.body, options).then(
                (user) => {
                    if (user) {
                        res.json(user);
                        return next();
                    }
                    res.send(404);
                    return next();
                }
            );
        });
    }
}

export const usersRouter = new UsersRouter();
