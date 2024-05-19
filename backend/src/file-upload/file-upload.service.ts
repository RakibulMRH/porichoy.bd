// file-upload.service.ts
import { Injectable } from '@nestjs/common';
import { Express } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class FileUploadService {
  constructor(private usersService: UsersService) {}

  async uploadFile(userId: number, file: Express.Multer.File) {
    const user = await this.usersService.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    user.profilePicture = file.filename;

    // Update the user with the new profile picture
    await this.usersService.update(userId, user);

    return { message: 'File uploaded successfully', filename: file.filename };
  }
}