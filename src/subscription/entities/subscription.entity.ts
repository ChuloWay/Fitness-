import { AddOnService } from 'src/add-on-service/entities/add-on-service.entity';
import { Invoice } from 'src/invoice/entities/invoice.entity';
import { Member } from 'src/member/entities/member.entity';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { SubscriptionType } from '../enums/subcription.enum';

@Entity()
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: SubscriptionType,
  })
  type: SubscriptionType;

  @Column()
  startDate: Date;

  @Column({ nullable: true })
  dueDate?: Date;

  @Column('decimal', { precision: 10, scale: 2 })
  totalAmount: number;

  @Column({ default: true })
  isFirstMonth: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Member, (member) => member.subscriptions, { eager: true })
  @JoinColumn({ name: 'member_id' })
  member: Member;

  @OneToMany(() => AddOnService, (addOnService) => addOnService.subscription, {
    eager: true,
    cascade: true,
  })
  addOnServices: AddOnService[];

  @OneToMany(() => Invoice, (invoice) => invoice.subscription, {
    eager: true,
    cascade: true,
  })
  invoices: Invoice[];
  totalCost: number;
}
