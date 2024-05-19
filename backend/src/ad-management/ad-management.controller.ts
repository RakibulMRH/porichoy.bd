import { Controller, Get, Param, Put, Body, Post, Delete } from '@nestjs/common';
import { AdsManagementService } from './ad-management.services';
import { Ad } from './entities/ads.entity';
import { UpdateAdDto } from './dto/update-ad.dto';
import { TenantDto } from './dto/tenant.dto';
import { Tenant } from '../users/entities/tenant.enitity';

@Controller('adsmanagement')
export class AdsManagementController {
  constructor(private readonly adsService: AdsManagementService) {}

  @Get()
  async findAll(): Promise<Ad[]> {
    return this.adsService.findAll();
  }

  @Get(':adId')
  async findOne(@Param('adId') adId: number): Promise<Ad> {
    return this.adsService.findOne(adId);
  }

  @Put(':adId')
  async update(
    @Param('adId') adId: number,
    @Body() updateAdDto: UpdateAdDto,
  ): Promise<Ad> {
    return this.adsService.update(adId, updateAdDto);
  }

  @Put(':adId/block')
  async blockAd(@Param('adId') adId: number): Promise<Ad> {
    return this.adsService.blockAd(adId);
  }

  @Put(':adId/unblock')
  async unblockAd(@Param('adId') adId: number): Promise<Ad> {
    return this.adsService.unblockAd(adId);
  }

  // Ad management routes...

  @Post('tenants')
  async createTenant(@Body() tenantDto: TenantDto): Promise<Tenant> {
    return this.adsService.createTenant(tenantDto);
  }

  @Get('tenants')
async getAllTenants(): Promise<Tenant[]> {
  return this.adsService.getAllTenants();
}
@Get('tenants/:id?')
async getTenantById(@Param('id') id?: number): Promise<Tenant | Tenant[]> {
  if (id === undefined) {
    return this.adsService.getAllTenants();
  }
  return this.adsService.getTenantById(id);
}

  @Put('tenants/:id')
  async updateTenant(
    @Param('id') id: number,
    @Body() tenantDto: TenantDto,
  ): Promise<Tenant> {
    return this.adsService.updateTenant(id, tenantDto);
  }

  @Delete('tenants/:id')
  async deleteTenant(@Param('id') id: number): Promise<void> {
    return this.adsService.deleteTenant(id);
  }
}