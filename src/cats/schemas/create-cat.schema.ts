import * as Joi from 'joi'

// zod랑 똑같네
export const createCatSchema = Joi.object({
    name: Joi.string().required(),
    age: Joi.number().integer().min(0).required(),
    breed: Joi.string().required(),
})
