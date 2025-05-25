import { Module } from '@nestjs/common'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'

// 특정 도메인과 관련된 구성요소들을 응집력 있는 단위로 묶는다.
// 명시적으로 providers의 scope를 제어한다.(전역 프로바이더 방지, 명확한 의존성 관리)
@Module({
    controllers: [CatsController],
    providers: [CatsService],
})
export class CatsModule {}
