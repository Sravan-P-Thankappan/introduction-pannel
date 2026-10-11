import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'room' })
export class Room {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    capacity: number;

    @Column({ type: 'int', nullable: true, name: 'pair_intro_time' })
    pairIntroTime: number;

    @Column({ type: 'int', nullable: true, name: 'total_intro_time' })
    totalIntroTime: number;
}