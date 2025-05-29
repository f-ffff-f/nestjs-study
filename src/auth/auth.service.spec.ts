import { Test, TestingModule } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt'
import { UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import { UsersService, User } from '../users/users.service'
import { Role } from '../role/role.enum'

describe('AuthService', () => {
    let authService: AuthService
    let usersService: UsersService
    let jwtService: JwtService

    /**
     * Mock user data for testing
     */
    const mockUser: User = {
        userId: 1,
        username: 'testuser',
        password: 'testpassword',
        roles: [Role.User],
    }

    /**
     * Mock JWT token for testing
     */
    const mockAccessToken = 'mock.jwt.token'

    /**
     * Mock UsersService with findOne method
     */
    const mockUsersService = {
        findOne: jest.fn(),
    }

    /**
     * Mock JwtService with signAsync method
     */
    const mockJwtService = {
        signAsync: jest.fn(),
    }

    beforeEach(async () => {
        // Create testing module with mocked dependencies
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService, // ← 실제 AuthService 클래스 사용
                {
                    provide: UsersService, // ← 이 키로 의존성 주입할 때
                    useValue: mockUsersService, // ← 실제 대신 가짜 객체 사용
                },
                {
                    provide: JwtService, // ← 이 키로 의존성 주입할 때
                    useValue: mockJwtService, // ← 실제 대신 가짜 객체 사용
                },
            ],
        }).compile()

        // Get service instances
        authService = module.get<AuthService>(AuthService)
        usersService = module.get<UsersService>(UsersService)
        jwtService = module.get<JwtService>(JwtService)
    })

    afterEach(() => {
        // Clear all mocks after each test
        jest.clearAllMocks()
    })

    describe('Service initialization', () => {
        it('should be defined', () => {
            expect(authService).toBeDefined()
        })

        it('should have UsersService injected', () => {
            expect(usersService).toBeDefined()
        })

        it('should have JwtService injected', () => {
            expect(jwtService).toBeDefined()
        })
    })

    describe('signIn', () => {
        describe('successful authentication', () => {
            beforeEach(() => {
                // Setup successful mocks
                mockUsersService.findOne.mockResolvedValue(mockUser) // mockUser 객체를 반환하도록 설정
                mockJwtService.signAsync.mockResolvedValue(mockAccessToken) // mockAccessToken 문자열을 반환하도록 설정
            })

            it('should return access token when credentials are valid', async () => {
                // Act
                const result = await authService.signIn(
                    'testuser',
                    'testpassword'
                )

                // Assert
                expect(result).toEqual({
                    access_token: mockAccessToken,
                })
            })

            it('should call usersService.findOne with correct username', async () => {
                // Act
                await authService.signIn('testuser', 'testpassword')

                // Assert
                expect(mockUsersService.findOne).toHaveBeenCalledWith(
                    'testuser'
                )
                expect(mockUsersService.findOne).toHaveBeenCalledTimes(1)
            })

            it('should call jwtService.signAsync with correct payload', async () => {
                // Act
                await authService.signIn('testuser', 'testpassword')

                // Assert
                const expectedPayload = {
                    sub: mockUser.userId,
                    username: mockUser.username,
                }
                expect(mockJwtService.signAsync).toHaveBeenCalledWith(
                    expectedPayload
                )
                expect(mockJwtService.signAsync).toHaveBeenCalledTimes(1)
            })

            it('should handle different users correctly', async () => {
                // Arrange
                const anotherUser: User = {
                    userId: 2,
                    username: 'anotheruser',
                    password: 'anotherpassword',
                    roles: [Role.Admin],
                }
                mockUsersService.findOne.mockResolvedValue(anotherUser)

                // Act
                await authService.signIn('anotheruser', 'anotherpassword')

                // Assert
                const expectedPayload = {
                    sub: anotherUser.userId,
                    username: anotherUser.username,
                }
                expect(mockJwtService.signAsync).toHaveBeenCalledWith(
                    expectedPayload
                )
            })
        })

        describe('authentication failures', () => {
            it('should throw UnauthorizedException when user is not found', async () => {
                // Arrange
                mockUsersService.findOne.mockResolvedValue(undefined)

                // Act & Assert
                await expect(
                    authService.signIn('nonexistentuser', 'somepassword')
                ).rejects.toThrow(UnauthorizedException)

                expect(mockUsersService.findOne).toHaveBeenCalledWith(
                    'nonexistentuser'
                )
                expect(mockJwtService.signAsync).not.toHaveBeenCalled()
            })

            it('should throw UnauthorizedException when password is incorrect', async () => {
                // Arrange
                mockUsersService.findOne.mockResolvedValue(mockUser)

                // Act & Assert
                await expect(
                    authService.signIn('testuser', 'wrongpassword')
                ).rejects.toThrow(UnauthorizedException)

                expect(mockUsersService.findOne).toHaveBeenCalledWith(
                    'testuser'
                )
                expect(mockJwtService.signAsync).not.toHaveBeenCalled()
            })

            it('should throw UnauthorizedException when password is empty', async () => {
                // Arrange
                mockUsersService.findOne.mockResolvedValue(mockUser)

                // Act & Assert
                await expect(
                    authService.signIn('testuser', '')
                ).rejects.toThrow(UnauthorizedException)
            })

            it('should throw UnauthorizedException when username is empty', async () => {
                // Arrange
                mockUsersService.findOne.mockResolvedValue(undefined)

                // Act & Assert
                await expect(
                    authService.signIn('', 'testpassword')
                ).rejects.toThrow(UnauthorizedException)
            })
        })

        describe('edge cases', () => {
            it('should handle UsersService throwing an error', async () => {
                // Arrange
                const serviceError = new Error('Database connection failed')
                mockUsersService.findOne.mockRejectedValue(serviceError)

                // Act & Assert
                await expect(
                    authService.signIn('testuser', 'testpassword')
                ).rejects.toThrow('Database connection failed')

                expect(mockJwtService.signAsync).not.toHaveBeenCalled()
            })

            it('should handle JwtService throwing an error', async () => {
                // Arrange
                mockUsersService.findOne.mockResolvedValue(mockUser)
                const jwtError = new Error('JWT signing failed')
                mockJwtService.signAsync.mockRejectedValue(jwtError)

                // Act & Assert
                await expect(
                    authService.signIn('testuser', 'testpassword')
                ).rejects.toThrow('JWT signing failed')

                expect(mockUsersService.findOne).toHaveBeenCalledWith(
                    'testuser'
                )
                expect(mockJwtService.signAsync).toHaveBeenCalled()
            })

            it('should handle user with null password', async () => {
                // Arrange
                const userWithNullPassword: User = {
                    ...mockUser,
                    password: '' as string, // Simulating empty/invalid password
                }
                mockUsersService.findOne.mockResolvedValue(userWithNullPassword)

                // Act & Assert
                await expect(
                    authService.signIn('testuser', 'testpassword')
                ).rejects.toThrow(UnauthorizedException)
            })

            it('should handle special characters in credentials', async () => {
                // Arrange
                const userWithSpecialPassword: User = {
                    ...mockUser,
                    password: 'p@ssw0rd!@#$%^&*()',
                }
                mockUsersService.findOne.mockResolvedValue(
                    userWithSpecialPassword
                )
                mockJwtService.signAsync.mockResolvedValue(mockAccessToken)

                // Act
                const result = await authService.signIn(
                    'testuser',
                    'p@ssw0rd!@#$%^&*()'
                )

                // Assert
                expect(result).toEqual({
                    access_token: mockAccessToken,
                })
            })
        })

        describe('method call verification', () => {
            it('should call methods in correct order', async () => {
                // Arrange
                mockUsersService.findOne.mockResolvedValue(mockUser)
                mockJwtService.signAsync.mockResolvedValue(mockAccessToken)

                // Act
                await authService.signIn('testuser', 'testpassword')

                // Assert - UsersService should be called before JwtService
                const findOneCall =
                    mockUsersService.findOne.mock.invocationCallOrder[0]
                const signAsyncCall =
                    mockJwtService.signAsync.mock.invocationCallOrder[0]
                expect(findOneCall).toBeLessThan(signAsyncCall)
            })

            it('should not call JWT service if user validation fails', async () => {
                // Arrange
                mockUsersService.findOne.mockResolvedValue(mockUser)

                // Act & Assert
                await expect(
                    authService.signIn('testuser', 'wrongpassword')
                ).rejects.toThrow(UnauthorizedException)

                expect(mockUsersService.findOne).toHaveBeenCalledTimes(1)
                expect(mockJwtService.signAsync).not.toHaveBeenCalled()
            })
        })
    })
})
