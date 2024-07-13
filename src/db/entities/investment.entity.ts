import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { RootEntity } from './root.entity'
import { User } from './user.entity'

@Entity({ name: 'investment' })
export class Investment extends RootEntity {
  @Column('decimal', { precision: 15, scale: 2 })
  originalAmount: number

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number

  @Column('timestamp', { nullable: true })
  withdrawalDate: Date | null

  @Column('decimal', { precision: 15, scale: 2, default: 0 })
  withdrawnAmount: number

  @Column({ type: 'timestamp' })
  creationDate: Date

  @ManyToOne(() => User, (user) => user.investments)
  @JoinColumn({ name: 'user_id' })
  user: User
}
