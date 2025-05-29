import {
    Body,
    Controller,
    Get,
    Header,
    HttpCode,
    HttpException,
    HttpStatus,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Redirect,
    Req,
    UseGuards,
    UsePipes,
} from '@nestjs/common'
import { Observable, of } from 'rxjs'
import { CatsService } from './cats.service'
import { CreateCatDto } from './dto/create-cat.dto'
import { Cat } from './interfaces/cat.interface'
import { JoiValidationPipe } from 'src/cats/pipe/joi-validation.pipe'
import { createCatSchema } from './schemas/create-cat.schema'
import { Roles } from 'src/role/role.decorator'
import { Role } from 'src/role/role.enum'
import { RolesGuard } from 'src/role/role.guard'

// nest g controller cats 명령어로 생성된 컨트롤러 클래스. 자동으로 보일러 플레이트를 생성해줌.
// @Controller('공통적으로 적용될 path prefix')
@Controller('cats')
export class CatsController {
    // The CatsService is injected through the class constructor.
    // private catsService: CatsService <--- 같은 줄에서 멤버로 선언하고 초기화 하는 단축코드
    // NestJS의 의존성 주입 시스템은 **의존성 역전 원칙(Dependency Inversion Principle, DIP)**을 따르는 좋은 예입니다. 컨트롤러(고수준 모듈)가 서비스(저수준 모듈)의 구체적인 생성 방식에 의존하는 대신, NestJS라는 프레임워크가 중간에서 의존성을 "주입"해줌으로써 둘 다 추상화(이 경우, 서비스 클래스 자체 또는 인터페이스)에 의존하게 됩니다. 이로 인해 유연하고 테스트하기 쉬운 코드를 작성할 수 있게 되죠.
    constructor(private catsService: CatsService) {}
    // private userSpecificData: string
    // 이런 식으로 요청별 데이터를 인스턴스 변수에 저장하면 안 됩니다! api endpoint는 stateless 해야 함.
    // 따라서 요청별 데이터를 저장하려면 요청 객체를 인자로 받아서 사용해야 함.

    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @UsePipes(new JoiValidationPipe(createCatSchema))
    @Post()
    // @HttpCode(204)
    // @Header('Cache-Control', 'no-store')
    // 클래스는 자바스크립트 ES6 표준의 한 부분이므로 자바스크립트로 컴파일 될 때, 사라지지 않고 실제 요소로 보존 그렇기 때문에 Pipes 같은 기능에서 런타임에 변수의 메타타입에 접근할 수 있음. 따서 DTO는 클래스로 선언하는 것이 좋음.
    create(@Body() createCatDto: CreateCatDto): void {
        this.catsService.create(createCatDto)
    }
    // @Get() 데코레이터는 findAll 메서드가 경로에 대한 HTTP GET 요청을 처리하는 핸들러 메서드임을 나타냄.
    // @Get()
    // findAll(): string {
    //     // 값만 리턴해라. 직렬화는 NestJS가 알아서 해준다.
    //     return 'This action returns all cats'
    // }

    // @Get()
    // async findAll(): Promise<any[]> {
    //     await new Promise((resolve) => setTimeout(resolve, 1000))
    //     return []
    // }
    @UseGuards(RolesGuard)
    @Roles(Role.Admin)
    @Get()
    findAll(): Observable<Cat[]> {
        return of(this.catsService.findAll())
        // NestJS가 제공하는 표준 예외처리. 유저에게 전송됨.
        // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN)
    }

    // @Get()
    // findAll(
    //     @Query('age') age: number,
    //     @Query('breed') breed: string
    // ): Observable<string> {
    //     return of(
    //         `This action returns all cats filtered by age: ${age} and breed: ${breed}`
    //     )
    // }

    @Get(':id')
    // id 파라미터에 파이프 적용
    // findOne(@Param('id', ParseIntPipe) id: number): Cat {
    findOne(
        @Param(
            'id',
            new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE })
        )
        id: number
    ): Cat {
        return this.catsService.findOne(id)
    }

    // @Get(':id')
    // findOne(@Param() params: any): string {
    //     console.log(params.id)
    //     return `This action returns a #${params.id} cat`
    // }

    // @Get()
    // findForUser(@Req() request: Request): string {
    //     this.userSpecificData = request.headers['x-user-id'] // 여러 요청이 동시에 접근 시 문제 발생
    //     // ... this.userSpecificData를 사용하는 로직 ...
    //     console.log(`Processing data for user: ${this.userSpecificData}`) // 다른 요청에 의해 훼손될 수 있음
    //     return `Data for ${this.userSpecificData}`
    // }

    // @Get('details')
    // getDetails(@Req() request: Request): string {
    //     const tenantId = request.headers['x-tenant-id']
    //     // tenantId는 이 메소드 호출 내에서만 유효합니다.
    //     // 필요한 로직을 여기서 처리하거나 서비스 계층으로 전달합니다.
    //     return `Details for tenant ${tenantId}`
    // }
}
