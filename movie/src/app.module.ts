import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { Member } from './entity/member.entity';
import { Rating } from './entity/rating.entity';
import { MemberController } from './controller/member.controller';
import { RatingController } from './controller/rating.controller';
import { AuthController } from './controller/auth.controller';
import { MemberService } from './service/member.service';
import { RatingService } from './service/rating.service';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: 3306,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([Member, Rating]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: Number(
            configService.get<string>('JWT_ACCESS_EXPIRATION') ?? 3600,
          ),
        },
      }),
    }),
  ],
  controllers: [MemberController, RatingController, AuthController],
  providers: [MemberService, RatingService, AuthService],
})
export class AppModule {}
