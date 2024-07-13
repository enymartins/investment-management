import { Entity, Column, OneToMany } from 'typeorm'
import { Investment } from './investment.entity'
import { RootEntity } from './root.entity'

@Entity()
export class User extends RootEntity {
  @Column()
  name: string

  @Column()
  email: string

  @Column({ unique: true })
  cpf: string

  @Column({ nullable: true })
  password: string

  @OneToMany(() => Investment, (investment) => investment.user)
  investments: Investment[]
}
