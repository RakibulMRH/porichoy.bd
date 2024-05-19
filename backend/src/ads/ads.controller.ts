import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdsService } from './ads.service';
import { Ad } from './entities/ads.entity';
import { CreateAdDto } from './dtos/createAd.dto';
import { UpdateAdDto } from './dtos/updateAd.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard'; 
import { Req } from '@nestjs/common';

@Controller('ads')
export class AdsController {
  constructor(private readonly adsService: AdsService) {}

  @Post() 
  @UseGuards(JwtAuthGuard)
  async createAd(@Body() adData: CreateAdDto): Promise<Ad> {
    console.log("here in ads controller createAd");
    return this.adsService.createAd(adData);
  }

  @Get() 
  async findAllAds(): Promise<Ad[]> {
    return this.adsService.findAllAds();
  }

@Get('view')
@UseGuards(JwtAuthGuard)
async findClientAds(@Req() req, @Param('clientId') clientId: string): Promise<Ad[]> {
  const numericClientId = parseInt(clientId, 10);
  
  // Extract user role and id from the request object
  const userRole = req.user.type;
  const userId = req.user.id;

  return this.adsService.findClientAds(userId, userRole);
}

  @Get(':adId')
  @UseGuards(JwtAuthGuard)
  async findOneAd(@Param('adId') adId: string): Promise<Ad> {
    const adId2 = parseInt(adId, 10);
    return this.adsService.findOneAd(adId2);
  }

  @Put(':adId')
  @UseGuards(JwtAuthGuard) 
  async updateAd(@Param('adId') adId: string, @Body() adData: UpdateAdDto): Promise<Ad> {
    const adId2 = parseInt(adId, 10);
    return this.adsService.updateAd(adId2, adData);
  }

  @Delete(':adId')
  @UseGuards(JwtAuthGuard) 
  async deleteAd(@Param('adId') adId: number): Promise<void> {
    return this.adsService.deleteAd(adId);
  }
}