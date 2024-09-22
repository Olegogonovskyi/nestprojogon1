import { PriseEnum } from '../../../database/enums/prise.enum';
import { BadRequestException } from '@nestjs/common';

export class ExchangeHelper {
  public static priseCalc(
    prise: PriseEnum,
    priseValue: number,
    eur: number,
    usd: number,
  ): { usdPrice: number; eurPrice: number; uahPrice: number } {
    let usdPrice;
    let eurPrice;
    let uahPrice;
    const numericPriseValue = Number(priseValue);
    switch (prise) {
      case PriseEnum.USD:
        usdPrice = numericPriseValue;
        eurPrice = (numericPriseValue * usd) / eur;
        uahPrice = numericPriseValue * usd;
        break;
      case PriseEnum.EUR:
        eurPrice = numericPriseValue;
        usdPrice = (numericPriseValue * eur) / usd;
        uahPrice = numericPriseValue * eur;
        break;
      case PriseEnum.UAH:
        uahPrice = numericPriseValue;
        usdPrice = numericPriseValue * usd;
        eurPrice = numericPriseValue * eur;
        break;
      default:
        throw new BadRequestException('Unsupported currency');
    }

    return { usdPrice, eurPrice, uahPrice };
  }
}

// : {usdPrice: number, eurPrice: number, uahPrice: number}
