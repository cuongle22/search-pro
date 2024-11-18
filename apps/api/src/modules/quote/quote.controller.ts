import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '~/decorators';
import { QuoteResponseMapper } from '~/mappers/responses/QuoteResponseMapper';
import {
  QuoteCreationDto,
  QuoteFilterDto,
  QuoteResponseDto,
} from '~/share/dtos';
import { UserResponseDto } from '~/share/dtos/user-response.dto';
import { QuoteService } from './quote.service';
import { RolesGuard } from '~/decorators/role-guard.decorator';
import { JwtGuard } from '../share/auth/guard';

@ApiTags('App - Quotes')
@Controller('quotes')
@RolesGuard('APP_USER')
@UseGuards(JwtGuard)
@ApiBearerAuth()
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  @ApiOperation({ summary: 'Quote a product' })
  @ApiResponse({ status: 200, type: [QuoteResponseDto] })
  async quoteProduct(
    @CurrentUser() user: UserResponseDto,
    @Body() quoteData: QuoteCreationDto,
  ): Promise<QuoteResponseDto> {
    const quote = await this.quoteService.createQuote(user.id, quoteData);

    const updatedQuote = await this.quoteService.findById(quote.id, user.id);
    if (!updatedQuote) {
      throw new NotFoundException('Product not found');
    }
    return new QuoteResponseMapper().map(updatedQuote);
  }

  @Get()
  @ApiOperation({ summary: 'List Quotes' })
  @ApiResponse({ status: 200, type: [QuoteResponseDto] })
  async searchQuotes(
    @CurrentUser() user: UserResponseDto,
    @Query() query: QuoteFilterDto,
  ): Promise<QuoteResponseDto[]> {
    const quotes = await this.quoteService.findByStatus(user.id, query.status);
    return new QuoteResponseMapper().mapArray(quotes);
  }

  @Get(':quoteId')
  @ApiOperation({ summary: 'Quote detail' })
  @ApiResponse({ status: 200, type: QuoteResponseDto })
  async getQuote(
    @Param('quoteId') quoteId: string,
    @CurrentUser() user: UserResponseDto,
  ): Promise<QuoteResponseDto> {
    const quote = await this.quoteService.findById(quoteId, user.id);
    if (!quote) {
      throw new NotFoundException('Product not found');
    }
    return new QuoteResponseMapper().map(quote);
  }
}
