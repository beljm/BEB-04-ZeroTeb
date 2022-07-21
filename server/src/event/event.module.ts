import { Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from './schemas/event.schema';
import { EventResultSchema } from './schemas/eventResult.schema';
import { LikedEventSchema } from './schemas/likedEvent.schema';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Event', schema: EventSchema },
      { name: 'EventResult', schema: EventResultSchema },
      { name: 'LikedEvent', schema: LikedEventSchema },
    ]),
    ScheduleModule.forRoot(),
  ],
  controllers: [EventController],
  providers: [EventService],
})
export class EventModule {}