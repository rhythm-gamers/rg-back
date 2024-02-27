import { HandleReportedDao } from '../dao/handle-reported.dao';

export interface HandleReportedUserDto extends HandleReportedDao {
  duration: number;
  reason: string;
}
