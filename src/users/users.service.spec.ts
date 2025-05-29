import { Test, TestingModule } from '@nestjs/testing'
import { UsersService, User } from './users.service'
import { Role } from 'src/role/role.enum'

describe('UsersService', () => {
    let service: UsersService
    let mockUsersData: User[]

    beforeEach(async () => {
        // Mock 데이터 준비
        mockUsersData = [
            {
                userId: 1,
                username: 'test',
                password: 'changeme',
                roles: [Role.Admin],
            },
            {
                userId: 2,
                username: 'maria',
                password: 'guess',
                roles: [Role.User],
            },
        ]

        const module: TestingModule = await Test.createTestingModule({
            providers: [UsersService],
        }).compile()

        service = module.get<UsersService>(UsersService)

        // private 프로퍼티에 접근하기 위한 안전한 타입 캐스팅
        Object.defineProperty(service, 'users', {
            value: mockUsersData,
            writable: true,
        })
    })

    afterEach(() => {
        jest.clearAllMocks()
    })

    it('should be defined', () => {
        expect(service).toBeDefined()
    })

    describe('findOne', () => {
        it('should return a user by username', async () => {
            const user = await service.findOne(mockUsersData[0].username)
            expect(user).toEqual(mockUsersData[0])
        })
    })

    describe('with spy', () => {
        it('should spy on findOne method', async () => {
            // 실제 메서드를 스파이로 감시
            const findOneSpy = jest.spyOn(service, 'findOne')

            await service.findOne(mockUsersData[0].username)

            // 스파이를 통해 메서드 호출 확인
            expect(findOneSpy).toHaveBeenCalledWith(mockUsersData[0].username)
            expect(findOneSpy).toHaveBeenCalledTimes(1)

            // 스파이 정리
            findOneSpy.mockRestore()
        })
    })
})
