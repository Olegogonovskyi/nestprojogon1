import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { bankUrl } from '../costants/PrivatBank';
import { HttpService } from '@nestjs/axios';
import { PriseEnum } from '../../../database/enums/prise.enum';

@Injectable()
export class BankCurService {
  constructor(private httpService: HttpService) {}

  async getExchangeRates(): Promise<any> {
    // ені забрати
    const response = await firstValueFrom(this.httpService.get(bankUrl));
    console.log(`response ${response.data}`);
    const eur = response.data.find((rate) => rate.ccy === PriseEnum.EUR)?.buy;
    const usd = response.data.find((rate) => rate.ccy === PriseEnum.USD)?.buy;

    console.log(`eur ${eur}`);
    console.log(`usd ${usd}`);

    return { eur, usd };
  }
}
