import {
    Body,
    Controller,
    Get,
    Header,
    HttpCode,
    Param,
    Post,
    Query,
    Redirect,
    Req,
} from '@nestjs/common'
import { Observable, of } from 'rxjs'
import { CatsService } from 'src/cats/cats.service'
import { CreateCatDto } from 'src/cats/dto/create-cat.dto'
import { Cat } from 'src/cats/interfaces/cat.interface'

// nest g controller cats 명령어로 생성된 컨트롤러 클래스. 자동으로 보일러 플레이트를 생성해줌.
// @Controller('공통적으로 적용될 path prefix')
@Controller('cats')
export class CatsController {
    // The CatsService is injected through the class constructor.
    // private catsService: CatsService <--- 같은 줄에서 멤버로 선언하고 초기화 하는 단축코드
    // IoC가 주입한다.
    constructor(private catsService: CatsService) {}
    // private userSpecificData: string
    // 이런 식으로 요청별 데이터를 인스턴스 변수에 저장하면 안 됩니다! api endpoint는 stateless 해야 함.
    // 따라서 요청별 데이터를 저장하려면 요청 객체를 인자로 받아서 사용해야 함.

    @Post()
    // @HttpCode(204)
    // @Header('Cache-Control', 'no-store')
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
    @Get()
    findAll(): Observable<Cat[]> {
        return of(this.catsService.findAll())
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
    findOne(@Param('id') id: string): string {
        console.log(id)
        return `This action returns a #${id} cat`
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
