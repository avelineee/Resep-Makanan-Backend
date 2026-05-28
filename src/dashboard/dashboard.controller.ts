import { Controller } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Get } from '@nestjs/common';

@Controller('dashboard')
export class DashboardController {
    constructor(
    private dashboardService:
      DashboardService,
  ) {}

  @Get('stats')
  async getDashboardStats() {

    const stats =
      await this.dashboardService.getStats();

    return {
      success: true,

      message:
        'Dashboard statistics retrieved successfully',

      stats,
    };
  }

}
