import { Controller, Get } from '@nestjs/common'
import { AppService } from './app.service'

// 주로 HTTP 요청을 받고 응답을 보내는 역할, 즉 프레젠테이션 계층 또는 API 계층의 역할을 합니다.

// AppController 클래스가 컨트롤러 클래스임을 나타냄. NestJS 런타임한테 알려주는 메타 데이터.
// 이 컨트롤러의 모든 핸들러는 '/'이라는 기본 경로를 가짐
@Controller()
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHello(): string {
        return this.appService.getHello()
    }
}
