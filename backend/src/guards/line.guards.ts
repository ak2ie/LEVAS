import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { validateSignature } from '@line/bot-sdk';

/**
 * LINEサーバーから送信されたことの検証
 */
@Injectable()
export class LineGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }

  /**
   * リクエストの署名を検証する
   * @param request リクエストオブジェクト
   * @returns 署名検証成功ならtrue、失敗ならfalse
   */
  private async validateRequest(request) {
    let signature = '';
    // 署名のフィールド名の大文字・小文字は変更される可能性がある
    if ('x-line-signature' in request.headers) {
      signature = request.headers['x-line-signature'];
    } else if ('X-Line-Signature' in request.headers) {
      signature = request.headers['X-Line-Signature'];
    } else {
      throw new Error('署名取得不可');
    }

    return validateSignature(
      request.rawBody,
      this.configService.get<string>('ENV_LINE_CHANNEL_SECRET'),
      signature,
    );
  }
}
