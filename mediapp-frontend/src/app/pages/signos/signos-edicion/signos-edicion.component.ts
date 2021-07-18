import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { Signos } from 'src/app/_model/signos';
import { SignosService } from 'src/app/_service/signos.service';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MatDialog} from '@angular/material/dialog';
import { startWith, map } from 'rxjs/operators';
import { PacienteModalComponent } from 'src/app/pages/paciente/paciente-modal/paciente-modal.component';

@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  constructor(
    private route: ActivatedRoute,
    private router : Router,
    private signosService : SignosService,
    private pacienteService : PacienteService,
    private datepipe: DatePipe,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'id_paciente' : new FormControl('', [Validators.required]),
      'nombre' : new FormControl('', [Validators.required]),
      'fecha' : new FormControl('', Validators.required),
      'temperatura': new FormControl(''),
      'pulso': new FormControl(''),
      'ritmoRespiratorio': new FormControl('')
    });

    this.route.params.subscribe((params: Params) => {
      this.id = params['id'];
      this.edicion = params['id'] != null;
      this.initForm();
      this.filteredOptions = this.form.controls['nombre'].valueChanges.pipe(
        //startWith(""),
        map(val => this.filter(val))
      );
      this.form.get('nombre').valueChanges.subscribe((nomb:string) => {
        const idx = nomb.indexOf(':');
        this.form.patchValue({
          'id_paciente': idx > 0 ? parseInt(nomb.substring(0, idx)) : ''
        });
      })
    });
  }

  initForm(){
    if(this.edicion){
      this.signosService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSignos),
          'id_paciente' : new FormControl(data.paciente.idPaciente, [Validators.required]),
          'nombre' : new FormControl(data.paciente.idPaciente + ': ' + data.paciente.nombres + ' ' + data.paciente.apellidos, [Validators.required, Validators.minLength(3)]),
          'fecha': new FormControl(this.datepipe.transform(new Date(data.fecha), 'yyyy-MM-dd'), Validators.required),
          'temperatura': new FormControl(data.temperatura),
          'pulso': new FormControl(data.pulso),
          'ritmoRespiratorio': new FormControl(data.ritmoRespiratorio)
        });
      });
    }
    this.actualizarAutocomplete();
  }

  actualizarAutocomplete() {
    this.pacienteService.listar().subscribe(data => {
      this.options = data.map(paciente => {
        return (paciente.idPaciente + ': ' + paciente.nombres + ' ' + paciente.apellidos).trim();
      });
    });
  }

  filter(val: string): string[] {
    return this.options.filter(option => {
      return option.toLowerCase().match(val.toLowerCase());
    });
  }

  get f() { return this.form.controls; }

  nuevoPaciente() {
    const dialogRef = this.dialog.open(PacienteModalComponent, {
      width: '360px',
      data: {}
    });
    dialogRef.afterClosed().subscribe((paciente: Paciente) => {
      if (paciente) {
        this.actualizarAutocomplete();
        this.form.patchValue({
          'id_paciente': paciente.idPaciente,
          'nombre': paciente.idPaciente + ': ' + paciente.nombres + ' ' + paciente.apellidos
        });
      }
    });
  }

  operar(){
    if(this.form.invalid){
      return;
    }

    let signos = new Signos();
    signos.idSignos = this.form.value['id'];
    signos.paciente = new Paciente();
    signos.paciente.idPaciente = this.form.value['id_paciente'];
    signos.fecha = new Date(this.form.value['fecha']);
    signos.temperatura = this.form.value['temperatura'];
    signos.pulso = this.form.value['pulso'];
    signos.ritmoRespiratorio = this.form.value['ritmoRespiratorio'];

    if(this.edicion){
      this.signosService.modificar(signos).subscribe( () => { this.notificarCambio('SE MODIFICO'); });
    }else{
      this.signosService.registrar(signos).subscribe( () => { this.notificarCambio('SE REGISTRO'); });
    }
    this.router.navigate(['signos']);
  }

  notificarCambio(msg: string) {
    this.signosService.listar().subscribe(data => {
      this.signosService.signosCambio.next(data);
      this.signosService.mensajeCambio.next(msg);
    });
  }

}
