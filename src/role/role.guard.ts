import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Role } from 'src/role/role.enum'
import { ROLES_KEY } from 'src/role/role.decorator'

@Injectable()
export class RolesGuard implements CanActivate {
    // Reflector는 메타데이터를 읽어오는 클래스
    // 1.타입 분석: NestJS가 생성자를 분석하여 Reflector 타입이 필요함을 인식
    // 2.의존성 해결: DI 컨테이너에서 Reflector 인스턴스를 찾음
    // 3.자동 주입: 가드 인스턴스 생성 시 Reflector 인스턴스를 자동으로 주입
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        // 사용처에서 정의한 @Roles 데코레이터의 ROLES_KEY에 저장돼있는 메타데이터를 읽어옴.
        // @Roles(Role.Admin) 이렇게 설정하면 메타데이터에 Role.Admin이 저장됨.
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            // 이 가드를 실행한 것(RolesGuard가 적용된 메서드나 클래스)를 반환
            [context.getHandler(), context.getClass()]
        )
        // 사용처에서 설정한 메타데이터가 없으면 그냥 통과 => @Roles()
        if (!requiredRoles) {
            return true
        }

        // http 요청을 가져와서 요청 body의 user를 가져옴
        const { user } = context
            .switchToHttp()
            .getRequest<Request & { user: { roles: Role[] } }>()

        return requiredRoles.some((role) => user?.roles?.includes(role))
    }
}
