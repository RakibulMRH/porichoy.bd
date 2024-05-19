import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ad } from '../ads/entities/ads.entity';
import { Tenant } from '../users/entities/tenant.enitity';
import { TenantDto } from './dto/tenant.dto';
import { getRepository } from 'typeorm'; // Import getRepository from typeorm


@Injectable()
export class AdsManagementService {
  constructor(
    @InjectRepository(Ad)
    private adsRepository: Repository<Ad>,
    @InjectRepository(Tenant)
    private tenantRepository: Repository<Tenant>,
  ) {}

  async findAll(): Promise<Ad[]> {
    return this.adsRepository.find();
  }

  async findOne(adId: number): Promise<Ad> {
    return this.adsRepository.findOne({ where: { adId } });
  }

  async update(adId: number, updatedAd: Partial<Ad>): Promise<Ad> {
    await this.adsRepository.update(adId, updatedAd);
    return this.findOne(adId);
  }

  async blockAd(adId: number): Promise<Ad> {
    const updatedAd = await this.update(adId, { status: 'blocked' });
    return updatedAd;
  }

  async unblockAd(adId: number): Promise<Ad> {
    const updatedAd = await this.update(adId, { status: 'active' });
    return updatedAd;
  }

//handle packages
  async createTenant(tenantDto: TenantDto): Promise<Tenant> {
    const tenant = this.tenantRepository.create(tenantDto);
    return this.tenantRepository.save(tenant);
  }

  async getAllTenants(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }
  
  async getTenantById(id: number): Promise<Tenant> {
    return this.tenantRepository.findOne({ where: { id } });
  }

  async updateTenant(id: number, tenantDto: TenantDto): Promise<Tenant> {
    await this.tenantRepository.update(id, tenantDto);
    return this.getTenantById(id);
  }

  async deleteTenant(id: number): Promise<void> {
    await this.tenantRepository.delete(id);
  }
}