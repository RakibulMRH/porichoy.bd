// profile.controller.ts
import { Controller, Post, Body, UseGuards, Request, UploadedFile, UseInterceptors, Headers } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { Param } from '@nestjs/common';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post('update/:id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profilePicture'))
  updateProfile( @Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto, 
  @Headers('authorization') authorization: string
) {
  const sessionToken = authorization.split(' ')[1];
  return this.profileService.updateProfile(id, updateProfileDto);
}
}
