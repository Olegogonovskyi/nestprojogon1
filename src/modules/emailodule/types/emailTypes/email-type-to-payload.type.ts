import { EmailEnum } from '../../enums/emailEnam';
import { EmailPayloadCombinedType } from './email-payload-combined.type';
import { PickRequired } from './pick-required.type';

export type EmailTypeToPayloadType = {
  [EmailEnum.WELCOME]: PickRequired<
    EmailPayloadCombinedType,
    'name' | 'frontUrl' | 'actionToken' | 'layout'
  >;

  [EmailEnum.OLD_VISIT]: PickRequired<
    EmailPayloadCombinedType,
    'name' | 'layout'
  >;
  [EmailEnum.GOODBYE]: PickRequired<
    EmailPayloadCombinedType,
    'name' | 'layout'
  >;
};
