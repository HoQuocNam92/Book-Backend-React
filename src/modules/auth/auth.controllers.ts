import { Request, Response, NextFunction } from 'express'
import { SignUp as signUpService } from '#/modules/auth/auth.services.js'

export const SignUp = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = await signUpService(req.body)
        res.status(201).json({
            message: 'Sign up success',
            data: user
        })
    } catch (err) {
        next(err) // đẩy lỗi về middleware
    }
}
