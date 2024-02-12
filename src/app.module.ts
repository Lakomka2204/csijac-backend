import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { VideoModule } from './video/video.module';
@Module({
  imports: [AuthModule,UserModule,VideoModule],
  providers:[AppService],
  exports:[AppService]
})
export class AppModule {}
