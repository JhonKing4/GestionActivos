import { SetMetadata } from '@nestjs/common';
import { Roles } from '../usuario/enums/roles.enum';

export const ROLES_KEY = 'roles';
export const RequireRoles = (...roles: Roles[]) =>
  SetMetadata(ROLES_KEY, roles);
