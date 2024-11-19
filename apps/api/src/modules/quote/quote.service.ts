import {
  AutoPath,
  EntityManager,
  FilterQuery,
  QueryOrder,
} from '@mikro-orm/core';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ContactEntity, ProductLocationEntity, QuoteEntity } from '~/entities';
import { QuoteStatus } from '~/share/consts/enums';
import { QuoteCreationDto } from '~/share/dtos';

@Injectable()
export class QuoteService {
  public defaultPopulate: AutoPath<QuoteEntity, any> = [
    'store',
    'requestor',
    'contact',
    'comments',
    'productLocation',
    'productLocation.location',
    'productLocation.product',
  ] as never[];
  constructor(private readonly em: EntityManager) {}

  private getPopulates(populate?: string[]) {
    if (populate) {
      return populate as never[];
    }
    return this.defaultPopulate as never[];
  }

  //FIXME: This method is not used anywhere in the codebase
  async createQuote(requesterId: string, data: QuoteCreationDto) {
    const existingQuote = await this.em.findOne(QuoteEntity, {
      productLocation: data.productLocationId,
      requestor: requesterId,
      status: QuoteStatus.WAITING,
    });
    if (existingQuote) {
      throw new BadRequestException('Quote is already created');
    }

    const productLocation = await this.em.findOne(
      ProductLocationEntity,
      { id: data.productLocationId },
      { populate: ['location.store'] },
    );

    if (!productLocation) {
      throw new BadRequestException('Product location not found');
    }

    const contact = this.em.create(ContactEntity, {
      name: data.name,
      email: data.email,
      phone: data.phone,
      note: data.note,
    });

    const quote = this.em.create(QuoteEntity, {
      productLocation: data.productLocationId,
      store: productLocation.location.store,
      requestor: requesterId,
      contact,
    });
    await this.em.persistAndFlush(quote);
    return quote;
  }

  async findById(
    id: string,
    requestorId: string,
    populate?: string[],
  ): Promise<QuoteEntity | null> {
    return this.em.findOne(
      QuoteEntity,
      { id, requestor: requestorId },
      {
        populate: this.getPopulates(populate),
      },
    );
  }

  async findByRequestor(
    requestorId: string,
    populate?: string[],
  ): Promise<QuoteEntity[]> {
    return this.em.find(
      QuoteEntity,
      { requestor: requestorId },
      {
        populate: this.getPopulates(populate),
        orderBy: { createdAt: QueryOrder.DESC },
      },
    );
  }

  async findByStatus(
    requestorId: string,
    status?: QuoteStatus,
    populate?: string[],
  ): Promise<QuoteEntity[]> {
    const conditions: FilterQuery<QuoteEntity> = { requestor: requestorId };
    if (status) {
      conditions.status = status;
    }
    return this.em.find(QuoteEntity, conditions, {
      populate: this.getPopulates(populate),
      orderBy: { createdAt: QueryOrder.DESC },
    });
  }
}
