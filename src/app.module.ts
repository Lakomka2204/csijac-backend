import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AModule } from './a/a.module';
@Module({
  imports: [AuthModule,UserModule, AModule],
  providers:[AppService],
  exports:[AppService]
})
export class AppModule {}
