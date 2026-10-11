import { Injectable } from '@nestjs/common';
import { RoomCapacity } from './dto/room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entity/room.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { User } from './entity/user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }


  private async fetchUsers(lim) {
    const data = await axios.get(`https://randomuser.me/api/?results=${lim}`);
    return data.data?.results;
  }

  async setRoomCapacity(roomCapacity: RoomCapacity) {
    const capacity: number = roomCapacity.capacity;
    const room = await this.roomRepository.findOne({ where: {} });
    let lim = 10;
    if (capacity > lim) lim = capacity;
    if (room) {
      const oldCapacity = room.capacity;
      let change = capacity - oldCapacity;
      if (change < 0) {
        change = Math.abs(change)
        const users = await this.userRepository.find({ order: { id: 'desc' }, take: change });
        const ids = users.map(u => u.id);
        await this.userRepository.delete(ids);
      } else {
        let users = await this.fetchUsers(lim);
        users = users.slice(oldCapacity, capacity);
        const newUsers: User[] = users.map(u => {
          return { firstName: u.name.first, lastName: u.name.last }
        });
        await this.userRepository.save(newUsers);
      }

      await this.roomRepository.update({ id: room.id }, { capacity });
    } else {
      const newRoom = this.roomRepository.create({ capacity });
      await this.roomRepository.save(newRoom);
      let users = await this.fetchUsers(lim);
      users = users.slice(0, capacity);
      const newUsers: User[] = users.map(u => {
        return { firstName: u.name.first, lastName: u.name.last }
      });
      await this.userRepository.save(newUsers);
    }
    return {
      message: "Capacity updated"
    }
  }
}
