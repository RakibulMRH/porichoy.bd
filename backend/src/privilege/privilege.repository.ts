import { Repository } from 'typeorm';
import { Privilege } from './entities/privilege.entity';

export class PrivilegeRepository extends Repository<Privilege> {}