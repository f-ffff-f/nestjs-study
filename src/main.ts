import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { logger } from 'src/logger.middleware'
import { HttpExceptionFilter } from 'src/http-exception.filter'

async function bootstrap() {
    // 1. NestJS 애플리케이션을 만드는 팩토리 클래스 메서드 실행. module injection
    const app = await NestFactory.create(AppModule)
    // 모든 라우트에 미들웨어 적용
    app.use(logger)
    // 모든 예외에 커스텀처리 적용 의존성 주입 불가
    // app.useGlobalFilters(new HttpExceptionFilter())

    // 2. 인바운드 요청 대기
    await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
