import {ZodError} from 'zod';
 export const validate = (schema) => (req,res,next) => {
     try {
         req.validateData = schema.parse(req,res)
         next()
     } catch (e) {
         if (e instanceof ZodError){
             res.status(400).json({
                 error: "Validation error",
                 details: err.errors.map(e => ({
                     path: e.path.join('.'),
                     message: e.message
                 })),
             })
         }
         next()
     }
}