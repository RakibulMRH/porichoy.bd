import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Ad } from './entities/ads.entity';
import { CreateAdDto } from './dtos/createAd.dto';
import { UpdateAdDto } from './dtos/updateAd.dto';
import { BadRequestException } from '@nestjs/common';
import { Between } from 'typeorm'; 
import { Subscription } from 'src/subscription/entities/subscription.entity'; 
import { MoreThan, LessThan } from 'typeorm';
import { User } from '../users/entities/user.entity'; // Import the UserRepository
import { Tenant } from '../users/entities/tenant.enitity'; // Import the TenantRepository
import { NotFoundException } from '@nestjs/common'; // Import the NotFoundException



@Injectable()
export class AdsService {
  constructor(
    @InjectRepository(Ad)
    private adsRepository: Repository<Ad>, 
     @InjectRepository(Subscription)
      private subscriptionRepository: Repository<Subscription>,
      @InjectRepository(User) // Add the InjectRepository decorator
      private userRepository: Repository<User>, // Add the Repository type
      @InjectRepository(Tenant) // Add the InjectRepository decorator
      private tenantRepository: Repository<Tenant> // Change the type to Repository<Tenant>
  ) {}


async createAd(adData: CreateAdDto): Promise<Ad> {
  const currentDate = new Date();

  const subscription = await this.subscriptionRepository.findOne({
    where: {
      user : { id: adData.clientId },
      startDate: LessThan(currentDate),
      endDate: MoreThan(currentDate)
    }
  });

  if (!subscription) {
    throw new BadRequestException('Users subscription has expired or not active');
  }

  const user = await this.userRepository.findOne({ where: { id: adData.clientId } });
  const tenant = await this.tenantRepository.findOne({ where: { id: adData.tenantId }});

  const ad = this.adsRepository.create({
    ...adData,
    client: user,
    tenant: tenant
  });

  return this.adsRepository.save(ad);
}

 async findAllAds(): Promise<Ad[]> {
    return this.adsRepository.find({ relations: ["client", "tenant"] });
}

  async findOneAd(adId: number): Promise<Ad> {
    return this.adsRepository.findOne({ where: { adId } });
  }

async updateAd(adId: number, adData: UpdateAdDto): Promise<Ad> {
  const ad = await this.adsRepository.findOne({ where: { adId } });
  
  if (!ad) {
    throw new NotFoundException(`Ad with id ${adId} not found`);
  }

  Object.assign(ad, adData);

  return this.adsRepository.save(ad);
}
  async deleteAd(adId: number): Promise<void> {
    await this.adsRepository.delete(adId);
  }

  async findClientAds(clientId: number, userRole: string): Promise<Ad[]> {
    console.log('userRole', userRole);
    if (userRole === 'admin') {
      return this.adsRepository.find();
    }
    return this.adsRepository.find({ where: { client: { id: clientId } } });
  }

  
}