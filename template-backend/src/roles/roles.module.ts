import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Roles])],
  controllers: [],
  providers: [],
  exports: [TypeOrmModule],
})
export class RolesModule {}
