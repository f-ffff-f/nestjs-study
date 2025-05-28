import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'

// 클래스형 미들웨어
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        console.log('Request...', req.method, req.originalUrl)
        next()
    }
}

// 함수형 미들웨어
export function logger(req: Request, res: Response, next: NextFunction) {
    console.log('Request...', req.method, req.originalUrl)
    next()
}
