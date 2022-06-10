import  {v4 as uuidv4} from 'uuid'
const faker = require("faker");

/*
* F.U.
* mise en place les endpoints API
* avec les donnees fake
* posterisation des images
* */
export const users = [
    {
        id:uuidv4(),
        email:  faker.internet.email(),
        password: 'password',
        lastname: faker.name.lastName(),
        firstname:faker.name.firstName(),
        avatar:faker.image.avatar(),
        isValidated: false,
    },
    {
        id:uuidv4(),
        email:  faker.internet.email(),
        password: 'password',
        lastname: "john ",
        firstname:faker.name.firstName(),
        avatar:faker.image.avatar(),
        isValidated: false,
    },
    {
        id:uuidv4(),
        email:  faker.internet.email(),
        password: 'password',
        lastname: faker.name.lastName(),
        firstname:faker.name.firstName(),
        avatar:faker.image.avatar(),
        isValidated: false,
    },
    {
        id:uuidv4(),
        email:  faker.internet.email(),
        password: 'password',
        lastname: faker.name.lastName(),
        firstname:faker.name.firstName(),
        avatar:faker.image.avatar(),
        isValidated: false,
    },
    {
        id:uuidv4(),
        email:  faker.internet.email(),
        password: 'password',
        lastname: faker.name.lastName(),
        firstname:faker.name.firstName(),
        avatar:faker.image.avatar(),
        isValidated: false,
        role: 'ROLE_ADMIN'
    }
]