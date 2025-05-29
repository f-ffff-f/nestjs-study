import { SetMetadata } from '@nestjs/common'
import { Role } from './role.enum'

// 메타데이터의 키
export const ROLES_KEY = 'roles'
// 컨트롤러 메서드에 역할 정보를 메타데이터로 저장
//Reflection API가 나중에 이 메타데이터를 읽을 수 있게 함
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
