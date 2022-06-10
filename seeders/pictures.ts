import  {v4 as uuidv4} from 'uuid'
const faker = require("faker");

export const pictures = [
    {
        id:faker.datatype.number(15),
        description: faker.lorem.sentence(),
        filename:uuidv4(),
        mime:faker.name.firstName(),
        can_be_shared: false,
    },
    {
        id:faker.datatype.number(15),
        description: faker.lorem.sentence(),
        filename:uuidv4(),
        mime:faker.name.firstName(),
        can_be_shared: false,
    },
    {
        id:faker.datatype.number(15),
        description: faker.lorem.sentence(),
        filename:uuidv4(),
        mime:faker.name.firstName(),
        can_be_shared: false,
    },
    {
        id:faker.datatype.number(15),
        description: faker.lorem.sentence(),
        filename:uuidv4(),
        mime:faker.name.firstName(),
        can_be_shared: false,
    }
]