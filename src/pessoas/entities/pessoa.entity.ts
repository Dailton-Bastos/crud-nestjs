import { RecadoEntity } from 'src/recados/entities/recado.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class PessoaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ length: 255 })
  passwordHash: string;

  @Column({ length: 100 })
  nome: string;

  // Uma pessoa pode ter enviado muitos recados (como "de")
  // Esses recados são relacionados ao campo "de" na entidade recado
  @OneToMany(() => RecadoEntity, (recado) => recado.de)
  recadosEnviados: RecadoEntity[];

  // Uma pessoa pode ter recebido muitos recados (como "para")
  // Esses recados são relacionados ao campo "para" na entidade recado
  @OneToMany(() => RecadoEntity, (recado) => recado.para)
  recadosRecebidos: RecadoEntity[];

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updateAt?: Date;

  @Column({ default: true })
  active: boolean;

  @Column({ default: '' })
  picture: string;

  // @Column({ type: 'simple-array', default: [] })
  // routePolicies: RoutePolicies[];
}
