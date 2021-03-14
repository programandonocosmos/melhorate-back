import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

type IPhone = {
  brand: string;
  model: string;
  ram: number;
  rom: number;
  picture: string;
};

@Entity()
class Phone implements IPhone {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  ram: number;

  @Column()
  rom: number;

  @Column()
  picture: string;
}

export { IPhone, Phone };
