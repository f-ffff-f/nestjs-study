import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { CatController } from './cat/cat.controller'

// 전체 애플리케이션의 모듈, 컨트롤러, 프로바이더(서비스 등) 관계의 시작점입니다.
// AppModule 클래스가 모듈 클래스임을 나타냄. NestJS 런타임한테 알려주는 메타 데이터
@Module({
    imports: [],
    controllers: [AppController, CatController],
    providers: [AppService],
})
export class AppModule {}
