import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Roles } from 'src/usuario/enums/roles.enum';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const userRoles = Array.isArray(user.roles) ? user.roles : [user.roles];

    console.log('User: ', user);
    console.log('Required Roles: ', requiredRoles);

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
