import { Controller } from '@nestjs/common'

// nest g controller cat 명령어로 생성된 컨트롤러 클래스. 자동으로 보일러 플레이트를 생성해줌.
// @Controller('공통적으로 적용될 path prefix')
@Controller('cat')
export class CatController {}
