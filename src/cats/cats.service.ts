import { Injectable } from '@nestjs/common'
import { Cat } from './interfaces/cat.interface'

// Injectable 데코레이터는 NestJS의 런타임 시스템(IoC: Inversion of Control 컨테이너)이 이를 관리하고 주입할 수 있음을 나타냄.
@Injectable()
export class CatsService {
    private readonly cats: Cat[] = []

    create(cat: Cat) {
        this.cats.push(cat)
    }

    findAll(): Cat[] {
        return this.cats
    }
}
