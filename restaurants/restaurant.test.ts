import 'jest';

import * as mongoose from 'mongoose';
import * as request from 'supertest';
import { environment } from '../common/environment';

let address: string = (<any>global).address;

test('get /restaurants', () => {
    return request(address)
        .get('/restaurants')
        .then((response) => {
            expect(response.status).toBe(200);
            expect(response.body.items).toBeInstanceOf(Array);
        })
        .catch(fail);
});
