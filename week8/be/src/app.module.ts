import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controller/auth.controller';
import { FavoriteController } from './controller/favorite.controller';
import { MemberController } from './controller/member.controller';
import { MovieRecordController } from './controller/movie-record.controller';
import { RatingController } from './controller/rating.controller';
import { Favorite } from './entity/favorite.entity';
import { Member } from './entity/member.entity';
import { Rating } from './entity/rating.entity';
import { AuthService } from './service/auth.service';
import { FavoriteService } from './service/favorite.service';
import { MemberService } from './service/member.service';
import { MovieRecordService } from './service/movie-record.service';
import { RatingService } from './service/rating.service';

const DEFAULT_ACCESS_EXPIRATION_SECONDS = 3600;

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST', 'localhost'),
        port: Number(configService.get('DB_PORT', 3306)),
        username: configService.get<string>('DB_USER', 'root'),
        password: configService.get<string>('DB_PASSWORD', ''),
        database: configService.get<string>('DB_NAME', 'umc_movie'),
        charset: 'utf8mb4',
        autoLoadEntities: true,
        synchronize: false,
        bigNumberStrings: false,
      }),
    }),
    TypeOrmModule.forFeature([Member, Rating, Favorite]),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          // 환경 변수는 문자열이라 초 단위 숫자로 바꿔서 넘김
          expiresIn: Number(
            configService.get(
              'JWT_ACCESS_EXPIRATION',
              DEFAULT_ACCESS_EXPIRATION_SECONDS,
            ),
          ),
        },
      }),
    }),
  ],
  controllers: [
    AuthController,
    MemberController,
    RatingController,
    FavoriteController,
    MovieRecordController,
  ],
  providers: [
    AuthService,
    MemberService,
    RatingService,
    FavoriteService,
    MovieRecordService,
  ],
})
export class AppModule {}
