import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { validateSignature } from '@line/bot-sdk';
import * as crypto from 'crypto';
import { getRepository } from 'fireorm';
import Setting from 'src/firestore/setting';

@Injectable()
export class LINEAuthGuard extends AuthGuard('line') {
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
  private async validateRequest(request: any) {
    let signature = '';
    // 署名のフィールド名の大文字・小文字は変更される可能性がある
    if ('x-line-signature' in request.headers) {
      signature = request.headers['x-line-signature'];
    } else if ('X-Line-Signature' in request.headers) {
      signature = request.headers['X-Line-Signature'];
    } else {
      throw new Error('署名取得不可');
    }

    if (!('destination' in request.body)) {
      return false;
    }
    const userId = request.body.destination;
    const settingRepository = getRepository(Setting);
    const record = await settingRepository
      //   .whereEqualTo((Setting) => Setting.userId, userId)
      //   .findOne();
      .findById(userId);
    if (!record) {
      return false;
    }
    const secret = record.channelSecret;

    // シグネチャを求めるコード（デバッグ用）
    // const body = JSON.stringify(request.body);
    // const validSignature = crypto
    //   .createHmac('SHA256', secret)
    //   .update(body)
    //   .digest('base64');
    // console.log(validSignature);

    return validateSignature(JSON.stringify(request.body), secret, signature);
  }
}
