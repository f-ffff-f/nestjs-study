import { Module } from '@nestjs/common'
import { CatsModule } from './cats/cats.module'

// 전체 애플리케이션의 모듈, 컨트롤러, 프로바이더(서비스 등) 관계의 시작점입니다.
// AppModule 클래스가 모듈 클래스임을 나타냄. NestJS 런타임한테 알려주는 메타 데이터
@Module({
    // feature module 임포트
    imports: [CatsModule],
})
export class AppModule {
    // cat route에 미들웨어 적용
    // configure(consumer: MiddlewareConsumer) {
    //     consumer.apply(logger).forRoutes(CatsController)
    // }
}
