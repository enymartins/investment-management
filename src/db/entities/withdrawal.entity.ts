import { Entity, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm'
import { Investment } from './investment.entity'
import { RootEntity } from './root.entity'

@Entity()
export class Withdrawal extends RootEntity {
  @Column('decimal', { precision: 15, scale: 2 })
  amount: number

  @CreateDateColumn()
  withdrawalDate: Date

  @Column('decimal', { precision: 15, scale: 2 })
  netValue: number
  
  @Column('decimal', { precision: 5, scale: 4 })
  taxRate: number

  @ManyToOne(() => Investment, (investment) => investment.withdrawals)
  @JoinColumn({ name: 'investment_id' })
  investment: Investment
}
