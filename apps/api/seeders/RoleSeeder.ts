import type { EntityManager } from '@mikro-orm/core';
import roleData from '../resources/roles.json';
import { BaseSeeder } from './BaseSeeder';
import { RoleEntity } from '../src/entities/RoleEntity';
import { UserRole } from '../src/share/consts/enums'; // Ensure the path is correct

export class RoleSeeder extends BaseSeeder {
  async run(em: EntityManager): Promise<void> {
    const roleEntities: RoleEntity[] = [];
    for (const item of roleData) {
      const role = em.create(RoleEntity, {
        ...item,
        role: item.role as UserRole,
      });
      roleEntities.push(role);
    }
    await em.persistAndFlush(roleEntities);
  }
}
