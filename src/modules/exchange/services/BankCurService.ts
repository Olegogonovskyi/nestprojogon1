import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { bankUrl } from '../costants/PrivatBank';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class BankCurService {
  constructor(private httpService: HttpService) {}

  async getExchangeRates(): Promise<any> {
    // ені забрати
    const response = await firstValueFrom(this.httpService.get(bankUrl));
    return response.data;
  }
}
