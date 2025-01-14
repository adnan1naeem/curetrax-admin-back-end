import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {DatabaseModule} from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { TeamModule } from './team/team.module';
import { HomeModule } from './home/home.module';
import { TimelineModule } from './timeline/timeline.module';
import { HealthcareProviderModule } from './healthcare-provider/healthcare-provider.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [DatabaseModule, AuthModule, TeamModule, HomeModule, TimelineModule, HealthcareProviderModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
