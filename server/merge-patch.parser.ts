/**
 * A necessidade deste script é pq não existe um plugin pronto
 * para lidar com esse tipo de content-type.
 */
import * as restify from 'restify';
import { BadRequestError } from 'restify-errors';

const mpContentType = 'application/merge-patch+json';

export const mergePatchBodyParser = (
    req: restify.Request,
    res: restify.Response,
    next
) => {
    if (req.getContentType() === mpContentType && req.method === 'PATCH') {
        (<any>req).rawBody = req.body;

        try {
            req.body = JSON.parse(req.body);
        } catch (error) {
            return next(
                new BadRequestError(`Invalid content: ${error.message}`)
            );
        }
    }
    return next();
};
