import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from 'src/users/users.service';
import { Express } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

 async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
  console.log('userId',userId);
  const id = Number(userId);
  if (isNaN(id)) {
    throw new Error('Invalid user ID');
  }
  const user = await this.usersRepository.findOne({ where: { id } });
  if (!user) {
    throw new Error('User not found');
  }

  // Only update firstName, lastName, and profilePicture
  if (updateProfileDto.firstName) {
    user.firstName = updateProfileDto.firstName;
  }
  if (updateProfileDto.lastName) {
    user.lastName = updateProfileDto.lastName;
  }
  if (updateProfileDto.profilePicture) {
    user.profilePicture = updateProfileDto.profilePicture;
  }

  const updatedUser = await this.usersRepository.save(user);

  // Return the updated user data in the desired format
  return {
    id: updatedUser.id,
    email: updatedUser.email,
    firstName: updatedUser.firstName,
    lastName: updatedUser.lastName,
    role: updatedUser.type,
    profilePicture: updatedUser.profilePicture,
    tenantId: updatedUser.tenantId,
  };
}
}