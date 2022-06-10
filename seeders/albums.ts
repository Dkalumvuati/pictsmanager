import  {v4 as uuidv4} from 'uuid'
const faker = require("faker");

export const albums = [
    {
        id:faker.datatype.number(15),
        description: faker.lorem.sentence(),
        name:uuidv4(),
        can_be_shared: false,
    },
    {
        id:faker.datatype.number(15),
        description: faker.lorem.sentence(),
        name:uuidv4(),
        can_be_shared: true,
    },
    {
        id:faker.datatype.number(15),
        description: faker.lorem.sentence(),
        name:uuidv4(),
        can_be_shared: false,
    },
    {
        id:faker.datatype.number(15),
        description: faker.lorem.sentence(),
        name:uuidv4(),
        can_be_shared: true,
    }
]