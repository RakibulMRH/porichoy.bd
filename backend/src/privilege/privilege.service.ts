import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePrivilegeDto } from './dto/create-privilege.dto';
import { UpdatePrivilegeDto } from './dto/update-privilege.dto';
import { Privilege } from './entities/privilege.entity';

@Injectable()
export class PrivilegeService {
  constructor(
    @InjectRepository(Privilege)
    private privilegeRepository: Repository<Privilege>,
  ) {}

  async create(createPrivilegeDto: CreatePrivilegeDto): Promise<Privilege> {
    const privilege = this.privilegeRepository.create(createPrivilegeDto);
    return this.privilegeRepository.save(privilege);
  }

  async findAll(): Promise<Privilege[]> {
    return this.privilegeRepository.find();
  }

  async findOne(id: number): Promise<Privilege> {
    return this.privilegeRepository.findOne({ where: { privId: id } });
  }

  async update(id: number, updatePrivilegeDto: UpdatePrivilegeDto): Promise<Privilege> {
    const privilege = await this.findOne(id);
    this.privilegeRepository.merge(privilege, updatePrivilegeDto);
    return this.privilegeRepository.save(privilege);
  }

  async remove(id: number): Promise<void> {
    await this.privilegeRepository.delete(id);
  }
}