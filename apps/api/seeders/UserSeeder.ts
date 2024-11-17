import type { EntityManager } from '@mikro-orm/core';
import * as argon from 'argon2';
import { UserStatus } from '~/share/consts/enums';
import { RoleEntity, UserEntity } from 'src/entities';
import usersData from '../resources/users.json';
import { BaseSeeder } from './BaseSeeder';

export class UserSeeder extends BaseSeeder {
  async run(em: EntityManager): Promise<void> {
    const userEntities: UserEntity[] = [];
    const roles = await em.find(RoleEntity, {});

    for (const item of usersData) {
      const role = roles.find((r) => String(r.role) === item.role);
      if (!role) {
        throw new Error(`Role ${item.role} not found`);
      }

      const hashPassword = await argon.hash(item.password);
      const user = em.create(UserEntity, {
        ...item,
        password: hashPassword,
        role: role,
        status: item.status as UserStatus,
      });
      userEntities.push(user);
    }
    await em.persistAndFlush(userEntities);
  }
}
