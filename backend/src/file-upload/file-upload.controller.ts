// file-upload.controller.ts
import { Controller, Post, UploadedFile, UseInterceptors, Req, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from './file-upload.service';
import { Express } from 'express';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Post('dp-upload')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
    uploadFile(@Req() req, @UploadedFile() file: Express.Multer.File) {
  if (file.mimetype.startsWith('video/')) {
    // The uploaded file is a video file
    // Handle the video file
  } else {
    // The uploaded file is not a video file
    // Handle the file normally
    return this.fileUploadService.uploadFile(req.user.id, file);
  }
   // return this.fileUploadService.uploadFile(req.user.id, file);
  }
}