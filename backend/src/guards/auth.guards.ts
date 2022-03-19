import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    return this.validateRequest(request);
  }

  private async validateRequest(request: Request) {
    try {
      await getAuth().verifyIdToken(
        request.headers['authorization'].replace('Bearer ', ''),
      );
      return true;
    } catch (e) {
      return false;
    }
  }
}
