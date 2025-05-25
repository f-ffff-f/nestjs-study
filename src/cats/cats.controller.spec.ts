import { Test, TestingModule } from '@nestjs/testing'
import { Observable } from 'rxjs'
import { TestScheduler } from 'rxjs/testing'
import { CatsController } from './cats.controller'
import { CatsService } from './cats.service'
import { Cat } from './interfaces/cat.interface'

describe('CatsController', () => {
    let catsController: CatsController
    let catsService: CatsService
    let testScheduler: TestScheduler

    beforeEach(async () => {
        // NestJS 부트스트랩(프로바이더 주입)
        const module: TestingModule = await Test.createTestingModule({
            controllers: [CatsController],
            providers: [CatsService],
        }).compile()

        // 테스트 할 준비가 된 모듈 get
        catsController = module.get<CatsController>(CatsController)
        catsService = module.get<CatsService>(CatsService)

        // RxJS TestScheduler 초기화
        testScheduler = new TestScheduler((actual, expected) => {
            expect(actual).toEqual(expected)
        })
    })

    it('should be defined', () => {
        expect(catsController).toBeDefined()
    })

    describe('findAll', () => {
        it('should return an Observable of cats array', (done) => {
            const mockCats: Cat[] = [
                {
                    name: 'Whiskers',
                    age: 3,
                    breed: 'Persian',
                },
                {
                    name: 'Shadow',
                    age: 2,
                    breed: 'Maine Coon',
                },
            ]

            // CatsService의 findAll 메서드를 모킹
            jest.spyOn(catsService, 'findAll').mockReturnValue(mockCats)

            const result: Observable<Cat[]> = catsController.findAll()

            // Observable이 반환되는지 확인
            expect(result).toBeInstanceOf(Observable)

            // Observable을 구독하여 값 확인
            result.subscribe({
                next: (cats) => {
                    expect(cats).toEqual(mockCats)
                    expect(cats).toHaveLength(2)
                    expect(cats[0].name).toBe('Whiskers')
                    done()
                },
                error: done,
            })
        })

        it('should return an empty Observable when no cats exist', (done) => {
            const mockCats: Cat[] = []

            jest.spyOn(catsService, 'findAll').mockReturnValue(mockCats)

            const result: Observable<Cat[]> = catsController.findAll()

            result.subscribe({
                next: (cats) => {
                    expect(cats).toEqual([])
                    expect(cats).toHaveLength(0)
                    done()
                },
                error: done,
            })
        })

        // RxJS TestScheduler를 사용한 마블 테스트 예제
        it('should emit cats array immediately using marble testing', () => {
            testScheduler.run(({ expectObservable }) => {
                const mockCats: Cat[] = [
                    {
                        name: 'Marble',
                        age: 1,
                        breed: 'Test',
                    },
                ]

                jest.spyOn(catsService, 'findAll').mockReturnValue(mockCats)

                const result$ = catsController.findAll()

                // 마블 다이어그램: (a|) = 즉시 값 a를 emit하고 complete
                expectObservable(result$).toBe('(a|)', { a: mockCats })
            })
        })
    })

    describe('create', () => {
        it('should call catsService.create with correct parameters', () => {
            const createCatDto = {
                name: 'Fluffy',
                age: 1,
                breed: 'British Shorthair',
            }

            // CatsService의 create 메서드를 스파이
            const createSpy = jest.spyOn(catsService, 'create')

            catsController.create(createCatDto)

            // create 메서드가 올바른 파라미터로 호출되었는지 확인
            expect(createSpy).toHaveBeenCalledWith(createCatDto)
            expect(createSpy).toHaveBeenCalledTimes(1)
        })
    })

    describe('findOne', () => {
        it('should return a string with the cat id', () => {
            const testId = '123'
            const result = catsController.findOne(testId)

            expect(result).toBe(`This action returns a #${testId} cat`)
        })
    })
})
