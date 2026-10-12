import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Request } from 'express';
import { PairIntroTime, RoomCapacity } from './dto/room.dto';


@Controller('room')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('people')
  setRoomCapacity(@Body() roomCapacity: RoomCapacity) {
    return this.appService.setRoomCapacity(roomCapacity);
  }

  @Post('intro-time')
  setPairIntroTime(@Body() pairIntroTime: PairIntroTime) {
    return this.appService.setPairIntroTime(pairIntroTime);
  }

  @Get('total-intro-time')
  totalIntroTime() {
    return this.appService.totalIntroTime();
  }
}
