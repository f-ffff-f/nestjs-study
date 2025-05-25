import { Injectable } from '@nestjs/common'

// 실제 비즈니스 로직을 처리하고, 데이터베이스 연동 등 핵심 기능을 수행하는 서비스 계층(또는 비즈니스 로직 계층)의 역할을 합니다.

@Injectable()
export class AppService {
    getHello(): string {
        return 'Hello World!'
    }
}
