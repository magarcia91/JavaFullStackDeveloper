import { Paciente } from './paciente';

export class Signos {
    idSignos: number;
    paciente: Paciente;
    fecha: Date;
    temperatura: number;
    pulso: number;
    ritmoRespiratorio: number;
}
