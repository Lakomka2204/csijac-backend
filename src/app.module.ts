import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
@Module({
  imports: [AuthModule,UserModule],
  providers:[AppService],
  exports:[AppService]
})
export class AppModule {}
