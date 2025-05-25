import * as request from 'supertest'
import { Test } from '@nestjs/testing'
import { AppModule } from '../src/app.module'
import { CatsService } from '../src/cats/cats.service'
import { INestApplication } from '@nestjs/common'

describe('Cats', () => {
    let app: INestApplication
    const catsService = { findAll: () => ['test'] }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(CatsService)
            .useValue(catsService)
            .compile()

        app = moduleRef.createNestApplication()
        await app.init()
    })

    it(`/GET cats`, () => {
        return request(app.getHttpServer())
            .get('/cats')
            .expect(200)
            .expect(catsService.findAll())
    })

    afterAll(async () => {
        await app.close()
    })
})
