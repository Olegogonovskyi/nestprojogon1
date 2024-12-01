import { ApiProperty } from '@nestjs/swagger';

export class PaidInfoResDto {
  @ApiProperty({ description: 'All views' })
  countViews: number;

  @ApiProperty({ description: 'Average prise' })
  averagePrice: number;

  @ApiProperty({ description: 'Views by day' })
  viewsByDay: number;

  @ApiProperty({ description: 'Views by week' })
  viewsByWeek: number;

  @ApiProperty({ description: 'Views by month' })
  viewsByMonth: number;
}
