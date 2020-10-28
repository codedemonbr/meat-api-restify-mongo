const users = [
    { name: 'Peter Parker', email: 'peter@marvel.com' },
    { name: 'Bruce Wayne', email: 'bruce@dc.com' },
];

export class User {
    //Usando promise para emular acesso assicrono. 
    //Como se estivessemos acessando banco de dados.
    static findAll(): Promise<any[]> {
        return Promise.resolve(users);
    }
}
