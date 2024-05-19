import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { BadRequestException } from '@nestjs/common';
import { sendResetPasswordEmail } from '../utils/email.util';  
import { generateResetToken } from '../utils/email.util';  
import { UserSession } from 'src/users/entities/userSession.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';  
import { ConflictException } from '@nestjs/common'; 
import { JwtService } from '@nestjs/jwt';
import { profile } from 'console';
import { Tenant } from 'src/users/entities/tenant.enitity';
import { UnauthorizedException } from '@nestjs/common';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { retry } from 'rxjs';

@Injectable()
export class AuthService {constructor(
  private readonly jwtService: JwtService,
  private readonly usersService: UsersService,
  @InjectRepository(UserSession)  
  private readonly userSessionRepository: Repository<UserSession> 
  , @InjectRepository(User)
  private readonly userRepository: Repository<User>,
  @InjectRepository(Subscription)
  private readonly subscriptionRepository: Repository<Subscription>

) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      //const sessionToken = randomBytes(16).toString('hex');
     // await this.usersService.createSessionToken(user.id, sessionToken); 
      const { password,  ...result } = user;

      return result;
      //return result;
    }
    return "Email or password is incorrect";
  }

  async login(user: any) {
    const payload = {
      email: user.email,
      id: user.id,
      type: user.type,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
      tenantId: user.tenantId,
    };

    user.tenantId = await this.checkAndUpdateExpiredSubscription(user.id);
    console.log('tenantId:', user.tenantId);
    return {
      access_token: this.jwtService.sign(payload),
      user_id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.type,
      profilePicture: user.profilePicture,
      tenantId: user.tenantId,
    };
  }

async checkAndUpdateExpiredSubscription(userId: number) {
  const user = await this.userRepository.findOne({ where: { id: userId }});
  console.log('user:', user);

  const subscription = await this.subscriptionRepository.findOne({
    where: {
      user: { id: userId }
    }
  });
  console.log('subscription:', subscription);

  if (!subscription || subscription.endDate < new Date()) { 
    console.log('subscription is null or has expired');
    user.tenantId = null;
    await this.userRepository.save(user);
    return user.tenantId;
  }
  return user.tenantId;
}

  async findBySessionToken(sessionToken: string): Promise<User | undefined> {
    const userSession = await this.userSessionRepository.findOne({
      where: { session_token: sessionToken },
      relations: ['user'],
    });
    
    return userSession ? userSession.user : undefined;
  }

  async logout(sessionToken: string) {
    const user = await this.usersService.findBySessionToken(sessionToken);
    if (user) {
      await this.usersService.removeSessionToken(sessionToken);
      return { message: 'Logout successful' };
    }
    return "Invalid session token";
  }

  async register(firstName: string, lastName: string, email: string, password: string, type: string, profilePicture: string) {
    // Check if a user with the same email already exists
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.usersService.create({ firstName, lastName, email, password: hashedPassword, type, profilePicture });
    return user;
  }
  async forgotPassword(email: string) {
    const user = await this.usersService.findByEmail(email);

    try 
    {
      const resetToken = generateResetToken();
      await sendResetPasswordEmail(email, resetToken);
      await this.usersService.updateResetPasswordToken(user.id, resetToken, new Date(Date.now() + 3600000));
      return { message: 'Reset password link has been sent to your email' };
    } 
    catch (error) 
    {
      return { message: 'Failed to send reset password email', error };
    }
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.usersService.findByResetPasswordToken(token);
    if (!user) {
        throw new NotFoundException('Invalid reset token');
    }

    if (user.resetPasswordExpires < new Date()) {
        throw new BadRequestException('Reset password token has expired');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this.usersService.resetPassword(user.id, hashedPassword);

    return { message: 'Password reset successful' };
  }

}