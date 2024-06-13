import { AddOnService } from 'src/add-on-service/entities/add-on-service.entity';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';

@Entity()
export class Member {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => Subscription, (subscription) => subscription.member, {
    cascade: true,
  })
  subscriptions: Subscription[];

  @OneToMany(() => AddOnService, (addOnServices) => addOnServices.member, {
    cascade: true,
  })
  addOnServices: AddOnService[];
}
