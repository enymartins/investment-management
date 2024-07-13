import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm'
import { RootEntity } from './root.entity'
import { User } from './user.entity'
import { Withdrawal } from './withdrawal.entity'

@Entity({ name: 'investment' })
export class Investment extends RootEntity {
  @Column('decimal', { precision: 15, scale: 2 })
  originalAmount: number

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number

  @Column({ type: 'timestamp' })
  creationDate: Date

  @ManyToOne(() => User, (user) => user.investments)
  @JoinColumn({ name: 'user_id' })
  user: User

  @OneToMany(() => Withdrawal, (withdrawal) => withdrawal.investment)
  withdrawals: Withdrawal[]
}
