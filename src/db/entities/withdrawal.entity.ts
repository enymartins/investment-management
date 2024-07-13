import { Entity, Column, ManyToOne, CreateDateColumn } from 'typeorm'
import { Investment } from './investment.entity'
import { RootEntity } from './root.entity'

@Entity()
export class Withdrawal extends RootEntity {
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number

  @CreateDateColumn()
  withdrawalDate: Date

  @ManyToOne(() => Investment, (investment) => investment.withdrawals)
  investment: Investment
}
