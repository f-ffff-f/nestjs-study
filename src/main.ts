import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

async function bootstrap() {
    // 1. NestJS 애플리케이션을 만드는 팩토리 클래스 메서드 실행. module injection
    const app = await NestFactory.create(AppModule)
    // 2. 인바운드 요청 대기
    await app.listen(process.env.PORT ?? 3000)
}
void bootstrap()
