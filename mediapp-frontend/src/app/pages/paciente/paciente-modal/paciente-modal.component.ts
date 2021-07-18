import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Paciente } from './../../../_model/paciente';
import { PacienteService } from './../../../_service/paciente.service';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-paciente-modal',
  templateUrl: './paciente-modal.component.html',
  styleUrls: ['./paciente-modal.component.css']
})
export class PacienteModalComponent implements OnInit {
  form: FormGroup;

  constructor(
    private pacienteService : PacienteService,
    public dialogRef: MatDialogRef<PacienteModalComponent>
  ) { }

  ngOnInit() {
    this.form = new FormGroup({
      'id' : new FormControl(0),
      'nombres' : new FormControl('', [Validators.required, Validators.minLength(3)]),
      'apellidos' : new FormControl('', [Validators.required, Validators.minLength(3)]),
      'email': new FormControl(''),
      'telefono': new FormControl('', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      'dni': new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(8)])
    });
  }

  get fr() { return this.form.controls; }

  submit() {
    if (this.form.invalid) return;
    const paciente: Paciente = new Paciente();
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.email = this.form.value['email'];
    paciente.telefono = this.form.value['telefono'];
    paciente.dni = this.form.value['dni'];
    this.pacienteService.registrar(paciente).subscribe(resp => {
      const location = resp.headers.get('Location');
      if (location) {
        paciente.idPaciente = parseInt(location.substring(location.lastIndexOf('/') + 1));
        this.dialogRef.close(paciente);
      } else {
        this.dialogRef.close(resp.body);
      }
    });
  }

  dispose() {
    this.dialogRef.close();
  }

}
